export type Program = {
  slug: string
  title: string
  age: string
  duration: string
  durationISO: string
  img: string
  accent: 'orange' | 'blue'
  featured?: boolean
  shortDescription: string
  description: string
  features: string[]
  curriculum: string[]
  outcomes: string[]
  teaches: string[]
}

export const programs: Program[] = [
  {
    slug: 'stem-foundations',
    title: 'STEM Foundations Program',
    age: '4–6 Years',
    duration: 'Structured Learning Program',
    durationISO: 'P12W',
    img: '/assets/robot1.png',
    accent: 'orange',
    featured: true,
    shortDescription: 'An early-childhood STEM program that introduces ages 4–6 to robotics, logic, and interactive technology through play-based learning.',
    description: 'The STEM Foundations Program is specially designed for young learners aged 4–6 in Vadodara. Through interactive, play-based sessions, children discover the fundamentals of robotics, engineering thinking, and creative problem-solving. Every activity is hands-on and age-appropriate, building curiosity and confidence from the very first session.',
    features: [
      'Early Robotics & STEM Exploration',
      'Logic Building, Creativity & Engineering Concepts',
      'Button-Based Coding & Interactive Activities',
    ],
    curriculum: [
      'Introduction to shapes, colours and patterns in engineering',
      'Hands-on building with blocks and basic robotics kits',
      'Cause-and-effect thinking through simple machines',
      'Button-based coding and sequencing activities',
      'Collaborative mini-projects and team challenges',
      'Presentations and show-and-tell of student creations',
    ],
    outcomes: [
      'Develops curiosity and love for technology from an early age',
      'Builds fine motor skills and spatial reasoning',
      'Introduces foundational engineering thinking',
      'Grows confidence through hands-on creation',
    ],
    teaches: ['STEM concepts', 'robotics fundamentals', 'logical thinking', 'creative problem-solving', 'basic coding'],
  },
  {
    slug: 'foundation-of-robotics',
    title: 'Foundation of Robotics – Level 1',
    age: '7–10 Years',
    duration: '120 Hours Program',
    durationISO: 'PT120H',
    img: '/assets/robot2.png',
    accent: 'blue',
    shortDescription: 'A 120-hour robotics program for ages 7–10 covering electronics, sensors, mechanics, and block coding through real robot-building projects.',
    description: 'Foundation of Robotics Level 1 is a 120-hour structured program for children aged 7–10 in Vadodara. Students learn how robots work by building them — starting with circuit basics, sensor integration, and mechanical assembly, then graduating to block-based programming. By the end of the program, every student has designed and built multiple functioning robots.',
    features: [
      'Robotics, Electronics & Circuit Flow',
      'Sensors, Mechanics & Robot Building',
      'Block Coding & Technology Fundamentals',
    ],
    curriculum: [
      'Introduction to electronics: components, circuits and safety',
      'Mechanical design: gears, motors and robot chassis construction',
      'Sensor integration: distance, light, and touch sensors',
      'Block-based programming: logic, loops and conditions',
      'Line-following and obstacle-avoidance robot builds',
      'Mini-competition and project showcase',
    ],
    outcomes: [
      'Understands how electronics and mechanics combine in robotics',
      'Can independently wire a basic circuit and assemble a robot chassis',
      'Writes block code to control robot behaviour',
      'Completes a working robot project for the program showcase',
    ],
    teaches: ['electronics', 'robotics', 'circuit design', 'mechanical assembly', 'block-based coding', 'sensors'],
  },
  {
    slug: 'advanced-robotics-level-2',
    title: 'Advanced Robotics – Level 2',
    age: '7–10 Years',
    duration: '120 Hours Program',
    durationISO: 'PT120H',
    img: '/assets/robot3.png',
    accent: 'blue',
    shortDescription: 'A 120-hour advanced robotics program for ages 7–10 introducing smart systems, AI concepts, and intelligent sensor programming.',
    description: 'Advanced Robotics Level 2 builds on Level 1 foundations, taking children aged 7–10 deeper into smart robotics systems and introductory AI. Students program robots that can sense, decide, and react — exploring topics such as intelligent sensor arrays, feedback loops, and the basics of machine behaviour. Designed for students who are ready to move beyond basic builds.',
    features: [
      'Advanced Robotics & Smart Systems',
      'Intelligent Sensors & Logic Programming',
      'Basic AI Concepts & Technical Projects',
    ],
    curriculum: [
      'Review and extension of Level 1 robotics concepts',
      'Advanced sensor use: IR arrays, ultrasonic, and colour sensors',
      'Logic programming: decision trees and conditional control',
      'Introduction to feedback systems and closed-loop control',
      'Basic AI concepts: rule-based behaviour and simple learning',
      'Capstone project: autonomous smart robot build',
    ],
    outcomes: [
      'Designs and programs a fully autonomous robot',
      'Understands sensor fusion and intelligent decision-making',
      'Applies introductory AI concepts in a physical robot build',
      'Ready to progress to coding-focused programs',
    ],
    teaches: ['advanced robotics', 'smart systems', 'AI fundamentals', 'logic programming', 'sensor arrays', 'autonomous systems'],
  },
  {
    slug: 'core-robotics-coding',
    title: 'Core Robotics & Coding Program',
    age: '11–14 Years',
    duration: '120 Hours Program',
    durationISO: 'PT120H',
    img: '/assets/robot4.png',
    accent: 'blue',
    shortDescription: 'A 120-hour robotics and coding program for ages 11–14 combining engineering, electronics, and text-based programming into real-world projects.',
    description: 'The Core Robotics & Coding Program is designed for teenagers aged 11–14 in Vadodara who want a rigorous introduction to engineering and software. Students move from block code to text-based programming, integrate electronics with code, and work through progressively complex robotics engineering challenges. The program builds strong STEM foundations for future academic and career pathways.',
    features: [
      'Robotics Engineering & Coding Concepts',
      'Electronics, Machine Systems & Programming',
      'Problem Solving & Project Development',
    ],
    curriculum: [
      'Transition from block code to text-based programming (Python/C++)',
      'Robotics engineering: design thinking and build cycles',
      'Electronics: microcontrollers, PWM, and motor drivers',
      'Machine systems: actuators, transmissions, and control systems',
      'Structured problem-solving and debugging techniques',
      'Individual capstone project with documentation',
    ],
    outcomes: [
      'Writes and debugs text-based code independently',
      'Designs a complete robot from brief to working prototype',
      'Understands microcontroller programming and electronics integration',
      'Develops structured engineering problem-solving skills',
    ],
    teaches: ['robotics engineering', 'Python', 'C++', 'electronics', 'microcontrollers', 'problem solving', 'project development'],
  },
  {
    slug: 'advanced-robotics-iot',
    title: 'Advanced Robotics, IoT & Smart Machines',
    age: '11–14 Years',
    duration: '120 Hours Program',
    durationISO: 'PT120H',
    img: '/assets/robot5.png',
    accent: 'orange',
    shortDescription: 'A 120-hour advanced program for ages 11–14 covering IoT systems, automation logic, and smart machine development for real-world applications.',
    description: 'Advanced Robotics, IoT & Smart Machines is the most advanced program offered at Branky STEM Labs, designed for teenagers aged 11–14 in Vadodara who are ready to build connected, intelligent systems. Students learn to design IoT-enabled devices, program automation logic, and develop smart machines that interact with the real world — preparing them for engineering, technology, and innovation pathways.',
    features: [
      'IoT Systems & Smart Machine Development',
      'Automation Logic & Connected Technologies',
      'Advanced Projects & Real-World Applications',
    ],
    curriculum: [
      'IoT architecture: sensors, actuators, networks and cloud basics',
      'Wireless communication: Wi-Fi, Bluetooth and MQTT protocols',
      'Smart home and smart city project design',
      'Automation logic: finite state machines and event-driven programming',
      'Data collection, display, and real-time monitoring dashboards',
      'Capstone: student-defined IoT or smart machine project',
    ],
    outcomes: [
      'Designs and deploys a working IoT system',
      'Understands wireless communication protocols and cloud connectivity',
      'Programs automation logic for real-world smart devices',
      'Capable of competing in national robotics and technology competitions',
    ],
    teaches: ['IoT', 'smart machines', 'automation', 'wireless communication', 'cloud basics', 'advanced programming', 'connected technologies'],
  },
]

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find(p => p.slug === slug)
}
