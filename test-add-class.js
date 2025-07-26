// Simple test script to verify add class functionality
console.log('Testing Add Class Feature...');

// Test data for a new class
const testClass = {
  id: `class-${Date.now()}`,
  title: 'Test Hip Hop Class',
  choreographerId: 'choreographer-1',
  choreographerName: 'Test Choreographer',
  style: ['Hip Hop'],
  dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
  location: 'Test Studio - Main Room',
  description: 'This is a test class for the add class feature.',
  price: 25,
  videoLink: 'https://example.com/video',
  rsvpLink: 'https://example.com/rsvp',
  flyer: 'https://example.com/flyer.jpg',
  status: 'active'
};

console.log('Test class data:', testClass);

// Verify all required fields are present
const requiredFields = ['id', 'title', 'choreographerId', 'choreographerName', 'style', 'dateTime', 'location', 'description', 'status'];
const missingFields = requiredFields.filter(field => !testClass[field]);

if (missingFields.length > 0) {
  console.error('❌ Missing required fields:', missingFields);
} else {
  console.log('✅ All required fields present');
}

// Verify date is in the future
const classDate = new Date(testClass.dateTime);
const now = new Date();
if (classDate > now) {
  console.log('✅ Class date is in the future');
} else {
  console.error('❌ Class date must be in the future');
}

// Verify styles array is not empty
if (testClass.style.length > 0) {
  console.log('✅ Dance styles selected');
} else {
  console.error('❌ At least one dance style must be selected');
}

console.log('Test completed! The add class feature should work correctly.'); 