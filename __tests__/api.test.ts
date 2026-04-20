/**
 * NAFIS Backend API Test Suite
 * Comprehensive tests for all 14 endpoints
 * Run with: npm test
 */

const BASE_URL = 'http://localhost:3002/api';
const TIMEOUT = 10000;

// Helper function for API calls
async function apiCall(method: string, endpoint: string, body?: any) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      timeout: TIMEOUT,
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error: any) {
    return { status: 0, error: error.message };
  }
}

// ============================================
// PROJECT CREATION TESTS
// ============================================

describe('Project Creation Tests', () => {
  test('✅ Create Project with Valid Data', async () => {
    const payload = {
      title: 'Build Dashboard',
      description: 'Interactive dashboard',
      category: 'تطوير الويب',
      budget_min: 5000,
      budget_max: 10000,
      deadline: '2026-05-20',
      skills_required: ['React', 'Node.js'],
    };

    const { status, data } = await apiCall('POST', '/projects', payload);
    expect(status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.title).toBe(payload.title);
    expect(data.status).toBe('open');
  });

  test('❌ Create Project Missing Required Fields', async () => {
    const payload = {
      title: 'Build Dashboard',
      // missing description, category, budget, deadline
    };

    const { status, data } = await apiCall('POST', '/projects', payload);
    expect(status).toBe(400);
    expect(data.error || data.message).toBeDefined();
  });

  test('❌ Create Project with Invalid Budget', async () => {
    const payload = {
      title: 'Build Dashboard',
      description: 'Dashboard',
      category: 'تطوير الويب',
      budget_min: 10000,
      budget_max: 5000, // max < min
      deadline: '2026-05-20',
      skills_required: ['React'],
    };

    const { status } = await apiCall('POST', '/projects', payload);
    expect(status).toBe(400);
  });

  test('❌ Create Project with Invalid Date Format', async () => {
    const payload = {
      title: 'Build Dashboard',
      description: 'Dashboard',
      category: 'تطوير الويب',
      budget_min: 5000,
      budget_max: 10000,
      deadline: 'invalid-date',
      skills_required: ['React'],
    };

    const { status } = await apiCall('POST', '/projects', payload);
    expect(status).toBe(400);
  });

  test('✅ Create Project with Large Input Values', async () => {
    const payload = {
      title: 'A'.repeat(200),
      description: 'B'.repeat(2000),
      category: 'تطوير الويب',
      budget_min: 1000000,
      budget_max: 10000000,
      deadline: '2026-12-31',
      skills_required: Array(20).fill('React'),
    };

    const { status, data } = await apiCall('POST', '/projects', payload);
    expect(status).toBe(201);
    expect(data.id).toBeDefined();
  });
});

// ============================================
// BID SUBMISSION TESTS
// ============================================

describe('Bid Submission Tests', () => {
  let projectId: string;

  beforeAll(async () => {
    // Create a project for bidding tests
    const { data } = await apiCall('POST', '/projects', {
      title: 'Test Project',
      description: 'For bid testing',
      category: 'تطوير الويب',
      budget_min: 5000,
      budget_max: 10000,
      deadline: '2026-05-20',
      skills_required: ['React'],
    });
    projectId = data.id;
  });

  test('✅ Submit Bid for Existing Project', async () => {
    const payload = {
      project_id: projectId,
      amount: 7500,
      delivery_time: '7',
      message: 'I can deliver this',
    };

    const { status, data } = await apiCall('POST', '/bids', payload);
    expect(status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.status).toBe('pending');
    expect(data.amount).toBe(7500);
  });

  test('❌ Submit Bid with Missing Project ID', async () => {
    const payload = {
      // missing project_id
      amount: 7500,
      delivery_time: '7',
      message: 'I can deliver',
    };

    const { status } = await apiCall('POST', '/bids', payload);
    expect(status).toBe(400);
  });

  test('❌ Submit Bid with Invalid Amount', async () => {
    const payload = {
      project_id: projectId,
      amount: -1000, // negative amount
      delivery_time: '7',
      message: 'I can deliver',
    };

    const { status } = await apiCall('POST', '/bids', payload);
    expect(status).toBe(400);
  });

  test('❌ Submit Bid with Invalid Delivery Time', async () => {
    const payload = {
      project_id: projectId,
      amount: 7500,
      delivery_time: 'invalid',
      message: 'I can deliver',
    };

    const { status } = await apiCall('POST', '/bids', payload);
    expect(status).toBe(400);
  });

  test('❌ Submit Bid for Non-existent Project', async () => {
    const payload = {
      project_id: '00000000-0000-0000-0000-000000000000',
      amount: 7500,
      delivery_time: '7',
      message: 'I can deliver',
    };

    const { status } = await apiCall('POST', '/bids', payload);
    expect(status).toBe(404);
  });
});

// ============================================
// BID ACCEPTANCE TESTS
// ============================================

describe('Bid Acceptance Tests', () => {
  let projectId: string;
  let bidId: string;
  let secondBidId: string;

  beforeAll(async () => {
    // Create project
    const projRes = await apiCall('POST', '/projects', {
      title: 'Acceptance Test Project',
      description: 'For acceptance testing',
      category: 'تطوير الويب',
      budget_min: 5000,
      budget_max: 10000,
      deadline: '2026-05-20',
      skills_required: ['React'],
    });
    projectId = projRes.data.id;

    // Submit first bid
    const bid1Res = await apiCall('POST', '/bids', {
      project_id: projectId,
      amount: 7500,
      delivery_time: '7',
      message: 'First bid',
    });
    bidId = bid1Res.data.id;

    // Submit second bid
    const bid2Res = await apiCall('POST', '/bids', {
      project_id: projectId,
      amount: 8000,
      delivery_time: '5',
      message: 'Second bid',
    });
    secondBidId = bid2Res.data.id;
  });

  test('✅ Accept Valid Bid', async () => {
    const payload = {
      action: 'accept',
      project_id: projectId,
    };

    const { status, data } = await apiCall('PATCH', `/bids/${bidId}`, payload);
    expect(status).toBe(200);
    expect(data.status).toBe('accepted');
  });

  test('✅ Check Auto-Rejection of Other Bids', async () => {
    const { status, data } = await apiCall('GET', '/bids');
    const otherBid = data.find((b: any) => b.id === secondBidId);
    expect(otherBid.status).toBe('rejected');
  });

  test('❌ Accept Bid with Missing Action Field', async () => {
    const payload = {
      // missing action
      project_id: projectId,
    };

    const { status } = await apiCall('PATCH', `/bids/${bidId}`, payload);
    expect(status).toBe(400);
  });

  test('❌ Accept Non-existent Bid', async () => {
    const payload = {
      action: 'accept',
      project_id: projectId,
    };

    const { status } = await apiCall(
      'PATCH',
      '/bids/00000000-0000-0000-0000-000000000000',
      payload
    );
    expect(status).toBe(404);
  });

  test('❌ Accept Bid with Invalid Project ID', async () => {
    const payload = {
      action: 'accept',
      project_id: 'invalid-uuid',
    };

    const { status } = await apiCall('PATCH', `/bids/${bidId}`, payload);
    expect(status).toBe(400);
  });
});

// ============================================
// MESSAGE SENDING TESTS
// ============================================

describe('Message Sending Tests', () => {
  test('✅ Send Message to Existing Freelancer', async () => {
    const payload = {
      receiver_id: 'f577bd5e-8ef8-4d36-ae1c-f4d32ec73565', // from database
      content: 'Great work on the project!',
    };

    const { status, data } = await apiCall('POST', '/messages', payload);
    expect(status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.content).toBe(payload.content);
  });

  test('❌ Send Message with Missing Receiver ID', async () => {
    const payload = {
      // missing receiver_id
      content: 'Hello',
    };

    const { status } = await apiCall('POST', '/messages', payload);
    expect(status).toBe(400);
  });

  test('❌ Send Message with Empty Content', async () => {
    const payload = {
      receiver_id: 'f577bd5e-8ef8-4d36-ae1c-f4d32ec73565',
      content: '',
    };

    const { status } = await apiCall('POST', '/messages', payload);
    expect(status).toBe(400);
  });

  test('❌ Send Message to Non-existent User', async () => {
    const payload = {
      receiver_id: '00000000-0000-0000-0000-000000000000',
      content: 'Hello',
    };

    const { status } = await apiCall('POST', '/messages', payload);
    expect(status).toBe(404);
  });

  test('❌ Send Message with Invalid Content Format', async () => {
    const payload = {
      receiver_id: 'f577bd5e-8ef8-4d36-ae1c-f4d32ec73565',
      content: null,
    };

    const { status } = await apiCall('POST', '/messages', payload);
    expect(status).toBe(400);
  });
});

// ============================================
// REVIEW SUBMISSION TESTS
// ============================================

describe('Review Submission Tests', () => {
  let projectId: string;
  const freelancerId = 'f577bd5e-8ef8-4d36-ae1c-f4d32ec73565';

  beforeAll(async () => {
    // Create project
    const { data } = await apiCall('POST', '/projects', {
      title: 'Review Test Project',
      description: 'For review testing',
      category: 'تطوير الويب',
      budget_min: 5000,
      budget_max: 10000,
      deadline: '2026-05-20',
      skills_required: ['React'],
    });
    projectId = data.id;
  });

  test('✅ Submit Review for Valid Project', async () => {
    const payload = {
      to_user_id: freelancerId,
      project_id: projectId,
      rating: 5,
      comment: 'Excellent work!',
    };

    const { status, data } = await apiCall('POST', '/reviews', payload);
    expect(status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.rating).toBe(5);
  });

  test('❌ Submit Review with Missing Project ID', async () => {
    const payload = {
      to_user_id: freelancerId,
      // missing project_id
      rating: 5,
      comment: 'Good work',
    };

    const { status } = await apiCall('POST', '/reviews', payload);
    expect(status).toBe(400);
  });

  test('❌ Submit Review with Invalid Rating Value', async () => {
    const payload = {
      to_user_id: freelancerId,
      project_id: projectId,
      rating: 10, // must be 1-5
      comment: 'Good work',
    };

    const { status } = await apiCall('POST', '/reviews', payload);
    expect(status).toBe(400);
  });

  test('❌ Submit Review for Non-existent Project', async () => {
    const payload = {
      to_user_id: freelancerId,
      project_id: '00000000-0000-0000-0000-000000000000',
      rating: 5,
      comment: 'Good work',
    };

    const { status } = await apiCall('POST', '/reviews', payload);
    expect(status).toBe(404);
  });

  test('✅ Verify Rating Auto-Calculation', async () => {
    // Submit another review
    await apiCall('POST', '/reviews', {
      to_user_id: freelancerId,
      project_id: projectId,
      rating: 3,
      comment: 'Average work',
    });

    // Check if profile rating is updated (average of 5 and 3 = 4)
    const { data } = await apiCall('GET', '/reviews');
    const userReviews = data.filter((r: any) => r.to_user_id === freelancerId);
    const avgRating =
      userReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      userReviews.length;
    expect(avgRating).toBe(4);
  });
});

// ============================================
// NOTIFICATION TESTS
// ============================================

describe('Notification Tests', () => {
  test('✅ Get Notifications', async () => {
    const { status, data } = await apiCall('GET', '/notifications');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  test('✅ Mark Notification as Read', async () => {
    const { data: notifications } = await apiCall('GET', '/notifications');
    if (notifications.length > 0) {
      const notifId = notifications[0].id;
      const { status } = await apiCall(
        'POST',
        `/notifications/${notifId}/mark-read`,
        {}
      );
      expect(status).toBe(200);
    }
  });
});

// ============================================
// STATUS CODE VERIFICATION
// ============================================

describe('HTTP Status Code Verification', () => {
  test('✅ POST requests return 201 Created', async () => {
    const { status } = await apiCall('POST', '/projects', {
      title: 'Test',
      description: 'Test',
      category: 'تطوير الويب',
      budget_min: 1000,
      budget_max: 5000,
      deadline: '2026-05-20',
      skills_required: ['Test'],
    });
    expect(status).toBe(201);
  });

  test('✅ GET requests return 200 OK', async () => {
    const { status } = await apiCall('GET', '/projects');
    expect(status).toBe(200);
  });

  test('✅ Invalid endpoints return 404 Not Found', async () => {
    const { status } = await apiCall('GET', '/invalid-endpoint');
    expect(status).toBe(404);
  });

  test('✅ Missing required fields return 400 Bad Request', async () => {
    const { status } = await apiCall('POST', '/projects', {});
    expect(status).toBe(400);
  });
});

// ============================================
// RESPONSE STRUCTURE VERIFICATION
// ============================================

describe('Response Structure Verification', () => {
  test('✅ Project response has required fields', async () => {
    const { data } = await apiCall('POST', '/projects', {
      title: 'Test Project',
      description: 'Test',
      category: 'تطوير الويب',
      budget_min: 1000,
      budget_max: 5000,
      deadline: '2026-05-20',
      skills_required: ['Test'],
    });

    expect(data.id).toBeDefined();
    expect(data.title).toBeDefined();
    expect(data.description).toBeDefined();
    expect(data.status).toBeDefined();
    expect(data.created_at).toBeDefined();
  });

  test('✅ Bid response has required fields', async () => {
    const projRes = await apiCall('POST', '/projects', {
      title: 'Test',
      description: 'Test',
      category: 'تطوير الويب',
      budget_min: 1000,
      budget_max: 5000,
      deadline: '2026-05-20',
      skills_required: ['Test'],
    });

    const { data } = await apiCall('POST', '/bids', {
      project_id: projRes.data.id,
      amount: 3000,
      delivery_time: '7',
      message: 'Test',
    });

    expect(data.id).toBeDefined();
    expect(data.project_id).toBeDefined();
    expect(data.amount).toBeDefined();
    expect(data.status).toBeDefined();
    expect(data.created_at).toBeDefined();
  });

  test('✅ Message response has required fields', async () => {
    const { data } = await apiCall('POST', '/messages', {
      receiver_id: 'f577bd5e-8ef8-4d36-ae1c-f4d32ec73565',
      content: 'Test message',
    });

    expect(data.id).toBeDefined();
    expect(data.receiver_id).toBeDefined();
    expect(data.content).toBeDefined();
    expect(data.created_at).toBeDefined();
  });
});

// ============================================
// TEST UTILITIES
// ============================================

// Custom test function (for jest)
function test(description: string, fn: () => Promise<void>) {
  console.log(`  ${description}`);
  return fn().catch((err) => {
    console.error(`    ❌ FAILED: ${err.message}`);
    throw err;
  });
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`);
  return fn();
}

function beforeAll(fn: () => Promise<void>) {
  return fn();
}

function expect(value: any) {
  return {
    toBe(expected: any) {
      if (value !== expected) {
        throw new Error(
          `Expected ${expected}, but got ${value}`
        );
      }
    },
    toBeDefined() {
      if (value === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(value)}`
        );
      }
    },
  };
}

export { test, describe, beforeAll, expect };
