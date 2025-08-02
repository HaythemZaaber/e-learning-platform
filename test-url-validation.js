// Test URL validation
const testUrls = [
  "http://localhost:3001/uploads/Uploads/image/1753972983117-coverimage.jpg",
  "https://example.com/image.jpg",
  "http://localhost:3000/api/uploads/image.jpg",
  "ftp://example.com/image.jpg",
  "file:///path/to/image.jpg",
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  "",
  null,
  undefined,
  "   ",
  "not-a-url",
];

console.log("Testing URL validation...\n");

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}: "${url}"`);
  
  // Test if it's a valid URL
  let isValidUrl = false;
  try {
    if (url && url.trim()) {
      new URL(url);
      isValidUrl = true;
    }
  } catch (e) {
    isValidUrl = false;
  }
  
  console.log(`  Is valid URL: ${isValidUrl}`);
  console.log(`  Type: ${typeof url}`);
  console.log(`  Length: ${url ? url.length : 0}`);
  console.log(`  Trimmed: "${url ? url.trim() : ''}"`);
  console.log("");
});

console.log("Test completed!"); 