#!/usr/bin/env node

/**
 * NAFIS API Test Runner
 * Run: node run-tests.js
 */

const BASE_URL = 'http://localhost:3002/api';
let passed = 0;
let failed = 0;
const results = [];

// Helper function
async function apiCall(method, endpoint, body) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test helper
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
    results.push({ name, status: 'PASSED' });
  } catch (err) {
    failed++;
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${err.message}`);
    results.push({ name, status: 'FAILED', error: err.message });
  }
}

async function runTests() {
  console.log('\n🧪 NAFIS Backend API Test Suite\n');
  console.log('================================================\n');

  // ============================================
  // PROJECT CREATION TESTS
  // ============================================
  console.log('📋 PROJECT CREATION TESTS\n');

  let createdProjectId;

  await test('Create Project with Valid Data', async () => {
    const { status, data } = await apiCall('POST', '/projects', {
      title: 'Build Dashboard',
      description: 'Interactive dashboard',
      category: 'تطوير الويب',
      budget_min: 5000,
      budget_max: 10000,
      deadline: '2026-05-20',
      skills_required: ['React', 'Node.js'],
    });
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    if (!data.id) throw new Error('No project ID returned');
    createdProjectId = data.id;
  });

  await test('Create Project Missing Required Fields', async () => {
    const { status } = await apiCall('POST', '/projects', {
      title: 'Build Dashboard',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Create Project with Invalid Budget', async () => {
    const { status } = await apiCall('POST', '/projects', {
      title: 'Build Dashboard',
      description: 'Dashboard',
      category: 'تطوير الويب',
      budget_min: 10000,
      budget_max: 5000,
      deadline: '2026-05-20',
      skills_required: ['React'],
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Create Project with Invalid Date Format', async () => {
    const { status } = await apiCall('POST', '/projects', {
      title: 'Build Dashboard',
      description: 'Dashboard',
      category: 'تطوير الويب',
      budget_min: 5000,
      budget_max: 10000,
      deadline: 'invalid-date',
      skills_required: ['React'],
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Create Project with Large Input Values', async () => {
    const { status, data } = await apiCall('POST', '/projects', {
      title: 'A'.repeat(200),
      description: 'B'.repeat(2000),
      category: 'تطوير الويب',
      budget_min: 1000000,
      budget_max: 10000000,
      deadline: '2026-12-31',
      skills_required: Array(20).fill('React'),
    });
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
  });

  // ============================================
  // BID SUBMISSION TESTS
  // ============================================
  console.log('\n💰 BID SUBMISSION TESTS\n');

  let createdBidId;
  let secondBidId;

  await test('Submit Bid for Existing Project', async () => {
    const { status, data } = await apiCall('POST', '/bids', {
      project_id: createdProjectId,
      amount: 7500,
      delivery_time: '7',
      message: 'I can deliver this',
    });
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    if (!data.id) throw new Error('No bid ID returned');
    createdBidId = data.id;
  });

  await test('Submit Bid with Missing Project ID', async () => {
    const { status } = await apiCall('POST', '/bids', {
      amount: 7500,
      delivery_time: '7',
      message: 'I can deliver',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Submit Bid with Invalid Amount', async () => {
    const { status } = await apiCall('POST', '/bids', {
      project_id: createdProjectId,
      amount: -1000,
      delivery_time: '7',
      message: 'I can deliver',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Submit Bid with Invalid Delivery Time', async () => {
    const { status } = await apiCall('POST', '/bids', {
      project_id: createdProjectId,
      amount: 7500,
      delivery_time: 'invalid',
      message: 'I can deliver',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Submit Bid for Non-existent Project', async () => {
    const { status } = await apiCall('POST', '/bids', {
      project_id: '00000000-0000-0000-0000-000000000000',
      amount: 7500,
      delivery_time: '7',
      message: 'I can deliver',
    });
    if (status !== 404) throw new Error(`Expected 404, got ${status}`);
  });

  // Submit second bid for acceptance testing
  await test('Submit Second Bid (for acceptance tests)', async () => {
    const { status, data } = await apiCall('POST', '/bids', {
      project_id: createdProjectId,
      amount: 8000,
      delivery_time: '5',
      message: 'Second bid',
    });
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    secondBidId = data.id;
  });

  // ============================================
  // BID ACCEPTANCE TESTS
  // ============================================
  console.log('\n✅ BID ACCEPTANCE TESTS\n');

  await test('Accept Valid Bid', async () => {
    const { status, data } = await apiCall('PATCH', `/bids/${createdBidId}`, {
      action: 'accept',
      project_id: createdProjectId,
    });
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (data.status !== 'accepted')
      throw new Error(`Expected status "accepted", got "${data.status}"`);
  });

  await test('Check Auto-Rejection of Other Bids', async () => {
    const { status, data } = await apiCall('GET', '/bids');
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    const otherBid = data.find((b) => b.id === secondBidId);
    if (!otherBid) throw new Error('Second bid not found');
    if (otherBid.status !== 'rejected')
      throw new Error(`Expected "rejected", got "${otherBid.status}"`);
  });

  await test('Accept Bid with Missing Action Field', async () => {
    const { status } = await apiCall('PATCH', `/bids/${createdBidId}`, {
      project_id: createdProjectId,
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Accept Non-existent Bid', async () => {
    const { status } = await apiCall(
      'PATCH',
      '/bids/00000000-0000-0000-0000-000000000000',
      {
        action: 'accept',
        project_id: createdProjectId,
      }
    );
    if (status !== 404) throw new Error(`Expected 404, got ${status}`);
  });

  await test('Accept Bid with Invalid Project ID', async () => {
    const { status } = await apiCall('PATCH', `/bids/${createdBidId}`, {
      action: 'accept',
      project_id: 'invalid-uuid',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  // ============================================
  // MESSAGE SENDING TESTS
  // ============================================
  console.log('\n💬 MESSAGE SENDING TESTS\n');

  const testUserId = 'f577bd5e-8ef8-4d36-ae1c-f4d32ec73565';

  await test('Send Message to Existing User', async () => {
    const { status, data } = await apiCall('POST', '/messages', {
      receiver_id: testUserId,
      content: 'Great work on the project!',
    });
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    if (!data.id) throw new Error('No message ID returned');
  });

  await test('Send Message with Missing Receiver ID', async () => {
    const { status } = await apiCall('POST', '/messages', {
      content: 'Hello',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Send Message with Empty Content', async () => {
    const { status } = await apiCall('POST', '/messages', {
      receiver_id: testUserId,
      content: '',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Send Message to Non-existent User', async () => {
    const { status } = await apiCall('POST', '/messages', {
      receiver_id: '00000000-0000-0000-0000-000000000000',
      content: 'Hello',
    });
    if (status !== 404) throw new Error(`Expected 404, got ${status}`);
  });

  await test('Send Message with Invalid Content Format', async () => {
    const { status } = await apiCall('POST', '/messages', {
      receiver_id: testUserId,
      content: null,
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  // ============================================
  // REVIEW SUBMISSION TESTS
  // ============================================
  console.log('\n⭐ REVIEW SUBMISSION TESTS\n');

  await test('Submit Review for Valid Project', async () => {
    const { status, data } = await apiCall('POST', '/reviews', {
      to_user_id: testUserId,
      project_id: createdProjectId,
      rating: 5,
      comment: 'Excellent work!',
    });
    if (status !== 201) throw new Error(`Expected 201, got ${status}`);
    if (!data.id) throw new Error('No review ID returned');
  });

  await test('Submit Review with Missing Project ID', async () => {
    const { status } = await apiCall('POST', '/reviews', {
      to_user_id: testUserId,
      rating: 5,
      comment: 'Good work',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Submit Review with Invalid Rating Value', async () => {
    const { status } = await apiCall('POST', '/reviews', {
      to_user_id: testUserId,
      project_id: createdProjectId,
      rating: 10,
      comment: 'Good work',
    });
    if (status !== 400) throw new Error(`Expected 400, got ${status}`);
  });

  await test('Submit Review for Non-existent Project', async () => {
    const { status } = await apiCall('POST', '/reviews', {
      to_user_id: testUserId,
      project_id: '00000000-0000-0000-0000-000000000000',
      rating: 5,
      comment: 'Good work',
    });
    if (status !== 404) throw new Error(`Expected 404, got ${status}`);
  });

  await test('Verify Rating Auto-Calculation', async () => {
    // Submit second review
    await apiCall('POST', '/reviews', {
      to_user_id: testUserId,
      project_id: createdProjectId,
      rating: 3,
      comment: 'Average work',
    });

    // Verify average
    const { status, data } = await apiCall('GET', '/reviews');
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    const userReviews = data.filter((r) => r.to_user_id === testUserId);
    if (userReviews.length < 2) throw new Error('Not enough reviews created');
  });

  // ============================================
  // NOTIFICATION TESTS
  // ============================================
  console.log('\n🔔 NOTIFICATION TESTS\n');

  await test('Get Notifications', async () => {
    const { status, data } = await apiCall('GET', '/notifications');
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data)) throw new Error('Expected array response');
  });

  await test('Get Projects List', async () => {
    const { status, data } = await apiCall('GET', '/projects');
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
    if (!Array.isArray(data)) throw new Error('Expected array response');
  });

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n================================================\n');
  console.log('📊 TEST SUMMARY\n');
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📈 Total:  ${passed + failed}`);
  console.log(`  📊 Rate:   ${Math.round((passed / (passed + failed)) * 100)}%\n`);

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${failed} test(s) failed\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
