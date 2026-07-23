import { aiService } from '../aiService';
import { srhKnowledgeBase } from '../srhKnowledgeBase';

// Mock dependencies
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

describe('AI Service & local SRH Knowledge Base', () => {
  it('should successfully match emergency/crisis keywords and return emergency guidance', async () => {
    const response = await aiService.sendMessage('help, i am in danger and bleeding');
    expect(response).toContain('Safety is the Absolute Priority');
    expect(response).toContain('Emergency Hotline');
  });

  it('should successfully match contraception keywords', async () => {
    const response = await aiService.sendMessage('tell me about plan b or implants');
    expect(response).toContain('Contraception & Safe Sex Practices');
    expect(response).toContain('Emergency Contraception');
  });

  it('should successfully match STI & HIV care keywords', async () => {
    const response = await aiService.sendMessage('what are the symptoms of chlamydia or hiv');
    expect(response).toContain('STI & HIV Prevention, Testing, and Care');
  });

  it('should successfully match male groin health keywords', async () => {
    const response = await aiService.sendMessage('how do you treat jock itch or tight foreskin');
    expect(response).toContain('Male Groin Conditions: Jock Itch & Phimosis');
  });

  it('should successfully match parent communication keywords', async () => {
    const response = await aiService.sendMessage('how do i talk to my parents or dad');
    expect(response).toContain('Communicating with Parents & Trusted Adults');
  });

  it('should fall back to general greeting/guidance when no keyword matches', async () => {
    const response = await aiService.sendMessage('what is the meaning of life');
    expect(response).toContain('I hear you');
    expect(response).toContain('period');
    expect(response).toContain('contraception');
  });
});
