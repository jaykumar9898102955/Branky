require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'branky-stemlab-super-secret-2025';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── MONGODB CONNECTION ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/branky-stemlab')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ── SCHEMAS & MODELS ──────────────────────────────────────────────────────────

// Registration Schema
const registrationSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  parentName: String,
  studentName: String,
  studentAge: Number,
  phone: String,
  schoolName: String,
  state: String,
  city: String,
  program: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  registeredAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model('Registration', registrationSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  id: Number,
  name: String,
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['super_admin', 'manager'], default: 'manager' },
  avatar: String,
});

const Admin = mongoose.model('Admin', adminSchema);

// ── INITIALIZE DEFAULT ADMINS ────────────────────────────────────────────────
async function initAdmins() {
  const existingAdmins = await Admin.countDocuments();
  if (existingAdmins === 0) {
    await Admin.insertMany([
      {
        id: 1,
        name: 'Super Admin',
        username: 'admin',
        passwordHash: bcrypt.hashSync('admin@123', 10),
        role: 'super_admin',
        avatar: 'SA',
      },
      {
        id: 2,
        name: 'Branky Manager',
        username: 'manager',
        passwordHash: bcrypt.hashSync('branky@2025', 10),
        role: 'manager',
        avatar: 'BM',
      },
    ]);
    console.log('📝 Default admins initialized');
  }
}

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// ── PUBLIC ROUTES ──────────────────────────────────────────────────────────────

// Health
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// Register
app.post('/api/register', async (req, res) => {
  const { parentName, studentName, studentAge, phone, schoolName, state, city, program } = req.body;

  if (!parentName || !studentName || !studentAge || !phone || !schoolName || !state || !city || !program) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const count = await Registration.countDocuments();
    const entry = new Registration({
      id: `REG-${String(count + 1).padStart(4, '0')}`,
      parentName,
      studentName,
      studentAge: Number(studentAge),
      phone,
      schoolName,
      state,
      city,
      program,
      status: 'pending',
      registeredAt: new Date(),
    });

    await entry.save();
    console.log('📋 New registration:', entry.id, studentName);

    return res.status(201).json({
      success: true,
      message: `Thanks ${parentName}! ${studentName}'s spot in "${program}" is reserved. We'll call you at ${phone} shortly.`,
      id: entry.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Error creating registration' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: 'Username and password required.' });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !bcrypt.compareSync(password, admin.passwordHash))
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name, role: admin.role, avatar: admin.avatar },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      success: true,
      token,
      user: { id: admin.id, name: admin.name, username: admin.username, role: admin.role, avatar: admin.avatar },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Error during login' });
  }
});

// ── PROTECTED ADMIN ROUTES ────────────────────────────────────────────────────

// Get all registrations with filters
app.get('/api/admin/registrations', authMiddleware, async (req, res) => {
  const { search, program, status, state, page = 1, limit = 10 } = req.query;

  try {
    let query = {};

    if (search) {
      const q = search.toLowerCase();
      query = {
        $or: [
          { studentName: { $regex: q, $options: 'i' } },
          { parentName: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
          { schoolName: { $regex: q, $options: 'i' } },
          { id: { $regex: q, $options: 'i' } },
        ],
      };
    }

    if (program && program !== 'all') query.program = program;
    if (status && status !== 'all') query.status = status;
    if (state && state !== 'all') query.state = state;

    const total = await Registration.countDocuments(query);
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const paginated = await Registration.find(query)
      .sort({ registeredAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.json({
      success: true,
      data: paginated,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Query error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching registrations' });
  }
});

// Update registration status
app.patch('/api/admin/registrations/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  try {
    const reg = await Registration.findOneAndUpdate({ id }, { status }, { new: true });
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

    return res.json({ success: true, data: reg });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ success: false, message: 'Error updating registration' });
  }
});

// Delete registration
app.delete('/api/admin/registrations/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Registration.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting registration' });
  }
});

// Dashboard stats
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const total = await Registration.countDocuments();
    const confirmed = await Registration.countDocuments({ status: 'confirmed' });
    const pending = await Registration.countDocuments({ status: 'pending' });
    const cancelled = await Registration.countDocuments({ status: 'cancelled' });

    const byProgram = await Registration.aggregate([
      { $group: { _id: '$program', count: { $sum: 1 } } },
      { $project: { _id: 0, program: '$_id', count: 1 } },
    ]);

    const byState = await Registration.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $project: { _id: 0, state: '$_id', count: 1 } },
    ]);

    // Last 7 days registrations
    const now = new Date();
    const last7 = Array.from({ length: 7 }, async (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      const startDate = new Date(key);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const count = await Registration.countDocuments({
        registeredAt: { $gte: startDate, $lt: endDate },
      });

      return {
        date: key,
        label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        count,
      };
    });

    const last7Data = await Promise.all(last7);

    const byProgramObj = {};
    byProgram.forEach(p => byProgramObj[p.program] = p.count);

    const byStateObj = {};
    byState.forEach(s => byStateObj[s.state] = s.count);

    return res.json({
      success: true,
      stats: {
        total,
        confirmed,
        pending,
        cancelled,
        byProgram: byProgramObj,
        byState: byStateObj,
        last7: last7Data,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

// Get all admins (super_admin only)
app.get('/api/admin/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'super_admin')
    return res.status(403).json({ success: false, message: 'Forbidden' });

  try {
    const admins = await Admin.find({}).select('-passwordHash');
    return res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Users error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching admins' });
  }
});

// Seed demo data
app.post('/api/admin/seed', authMiddleware, async (req, res) => {
  if (req.user.role !== 'super_admin')
    return res.status(403).json({ success: false, message: 'Forbidden' });

  try {
    const programs = ['Robotics & Coding', 'AI & Machine Learning', 'Electronics & IoT', '3D Design & Printing', '7-9 Years STEM Camp (6 Days)'];
    const states = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka'];
    const statuses = ['pending', 'confirmed', 'pending', 'confirmed', 'cancelled'];
    const schools = ['DPS Vadodara', 'Ryan International', 'Navrachana School', 'The Maharaja Sayajirao University', 'Kendriya Vidyalaya'];
    const names = [
      ['Arjun Patel', 'Ramesh Patel', 'Surat'],
      ['Priya Shah', 'Meena Shah', 'Vadodara'],
      ['Rohan Mehta', 'Vikram Mehta', 'Ahmedabad'],
      ['Aanya Gupta', 'Sunita Gupta', 'Delhi'],
      ['Dev Kumar', 'Rajiv Kumar', 'Bangalore'],
      ['Zara Khan', 'Farid Khan', 'Mumbai'],
      ['Ishaan Joshi', 'Pooja Joshi', 'Pune'],
      ['Ananya Nair', 'Suresh Nair', 'Kochi'],
      ['Vivaan Singh', 'Amit Singh', 'Jaipur'],
      ['Kavya Reddy', 'Ravi Reddy', 'Hyderabad'],
    ];

    // Clear existing registrations for seeding
    await Registration.deleteMany({});

    const seedData = names.map(([sName, pName, city], i) => ({
      id: `REG-${String(i + 1).padStart(4, '0')}`,
      studentName: sName,
      parentName: pName,
      studentAge: 7 + (i % 8),
      phone: `+91 ${9000000000 + i}`,
      schoolName: schools[i % schools.length],
      state: states[i % states.length],
      city,
      program: programs[i % programs.length],
      status: statuses[i % statuses.length],
      registeredAt: new Date(Date.now() - i * 86400000 * 0.7),
    }));

    await Registration.insertMany(seedData);

    return res.json({ success: true, message: `Seeded ${names.length} demo registrations` });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ success: false, message: 'Error seeding data' });
  }
});

const PORT = process.env.PORT || 5000;

// Wait for MongoDB connection before starting server
mongoose.connection.once('connected', () => {
  initAdmins().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Branky STEM Labs API → http://localhost:${PORT}`);
      console.log(`\n🔑 Admin Credentials:`);
      console.log(`   Username: admin     Password: admin@123   Role: Super Admin`);
      console.log(`   Username: manager   Password: branky@2025 Role: Manager\n`);
    });
  });
});
