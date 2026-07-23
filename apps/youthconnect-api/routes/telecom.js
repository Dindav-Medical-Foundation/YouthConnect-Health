const express = require('express');
const router = express.Router();

// SMS Gateway Webhook (Twilio compatible)
router.post('/incoming-sms', (req, res) => {
  const messageBody = req.body.Body || req.body.message || '';
  const fromNumber = req.body.From || '';

  console.log(`Received SMS from ${fromNumber}: ${messageBody}`);

  const replyText = getSimulatedReply(messageBody);

  // Send back XML format for Twilio SMS Webhook
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyText.slice(0, 1600)}</Message>
</Response>`);
});

// USSD Gateway Webhook (Stateless, Africa's Talking / Twilio USSD compatible)
// Receives: { sessionId, serviceCode, phoneNumber, text }
router.post('/ussd', (req, res) => {
  const { text } = req.body;
  let response = '';

  const cleanText = text ? text.trim() : '';

  if (cleanText === '') {
    // Level 0: Main Menu
    response = `CON Welcome to YouthConnect Health
Choose a topic:
1. Puberty & Body
2. Periods & Cramps
3. Contraception
4. STIs & HIV
5. Emergency Help`;
  } 
  // Level 1: Puberty & Body
  else if (cleanText === '1') {
    response = `CON Puberty & Body Changes:
1. Growth & Acne
2. Wet Dreams & Erections
3. Intimate Hygiene
99. Back`;
  } else if (cleanText === '1*1') {
    response = `END Growth & Acne:
Hormones trigger growth spurts, widening hips/shoulders, and active sweat glands. Acne is normal due to sebum shifts. Wash gently twice daily.`;
  } else if (cleanText === '1*2') {
    response = `END Wet Dreams:
Erections and wet dreams (releasing semen during sleep) are healthy, automatic signs of sperm production in growing bodies.`;
  } else if (cleanText === '1*3') {
    response = `END Intimate Hygiene:
Clean vulva with warm water ONLY (no soaps inside). Gently pull back uncircumcised foreskin and wash head of penis with warm water daily.`;
  } else if (cleanText === '1*99') {
    response = goToMainMenu();
  }
  // Level 1: Periods & Cramps
  else if (cleanText === '2') {
    response = `CON Periods & Cramps:
1. Cycle Lengths
2. Cramps Relief
3. Warning Signs
99. Back`;
  } else if (cleanText === '2*1') {
    response = `END Normal Cycle:
A typical period cycle is 21-35 days, with 3-7 bleeding days. Cycles can be highly irregular early on—that is normal.`;
  } else if (cleanText === '2*2') {
    response = `END Cramp Relief:
Apply heat (warm compress) to the lower abdomen, stay hydrated, do gentle stretches, or sip warm chamomile or ginger tea.`;
  } else if (cleanText === '2*3') {
    response = `END Warning Signs:
If you bleed through a pad in under an hour, have debilitating pain, or period stops for over 3 months, see a clinician.`;
  } else if (cleanText === '2*99') {
    response = goToMainMenu();
  }
  // Level 1: Contraception
  else if (cleanText === '3') {
    response = `CON Contraception:
1. Double Protection
2. Common Options
3. Emergency Pill
99. Back`;
  } else if (cleanText === '3*1') {
    response = `END Double Protection:
Double Protection means using a condom (for STI prevention) PLUS a highly effective hormonal method (pills/implant) to prevent pregnancy.`;
  } else if (cleanText === '3*2') {
    response = `END Birth Control:
Options include daily pills, upper-arm implants (3-5 years), IUDs (3-10 years), and injections (every 2-3 months). Condoms protect against STIs.`;
  } else if (cleanText === '3*3') {
    response = `END Emergency Pill (Plan B):
Take within 72 hours of unprotected sex. It delays ovulation to prevent pregnancy; it is not an abortion pill.`;
  } else if (cleanText === '3*99') {
    response = goToMainMenu();
  }
  // Level 1: STIs & HIV
  else if (cleanText === '4') {
    response = `CON STIs & HIV Prevention:
1. Common Symptoms
2. PrEP & PEP
3. Patient Privacy
99. Back`;
  } else if (cleanText === '4*1') {
    response = `END STI Symptoms:
Itching, sores, burning during urination, or unusual discharge. Note: Most STIs have ZERO symptoms. Get tested regularly!`;
  } else if (cleanText === '4*2') {
    response = `END HIV Prevention:
PrEP is a daily pill taken to prevent contracting HIV. PEP is an emergency 28-day regimen taken within 72 hours of potential exposure.`;
  } else if (cleanText === '4*3') {
    response = `END Medical Confidentiality:
Doctors are legally bound to keep your tests, results, and advice 100% private. No details are shared with parents or schools.`;
  } else if (cleanText === '4*99') {
    response = goToMainMenu();
  }
  // Level 1: Emergency Help
  else if (cleanText === '5') {
    response = `END Emergency Hotline:
Please call 911 / 112 or get to the nearest clinic immediately. For sexual assault support, seek medical help within 72 hours.`;
  } 
  // Unknown inputs fallback
  else {
    response = `END Invalid entry. Please dial again.`;
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
});

function goToMainMenu() {
  return `CON Welcome to YouthConnect Health
Choose a topic:
1. Puberty & Body
2. Periods & Cramps
3. Contraception
4. STIs & HIV
5. Emergency Help`;
}

// Local regex matcher for incoming SMS queries
function getSimulatedReply(message) {
  const lowerMessage = message.toLowerCase().trim();

  if (/\b(emergency|pain|bleeding|severe pain|hurt|suicide|self-harm|die|kill|abuse|danger|dangerous)\b/.test(lowerMessage)) {
    return "🚨 Safety Hotline: If you are experiencing a life-threatening emergency, call 911/112 or visit a clinic immediately. For local helpline assistance, dial our partner toll-free line.";
  }

  const keywords = [
    {
      keys: ['period', 'periods', 'menstruation', 'cramp', 'cramps'],
      ans: "🌸 Period Care: A normal cycle is 21-35 days, with 3-7 bleeding days. Relief: Apply heat to lower abdomen, stay hydrated, or stretch. See doctor for severe pain."
    },
    {
      keys: ['condom', 'contraception', 'pregnancy', 'pill', 'implant', 'iud'],
      ans: "🛡️ Contraception: Condoms prevent STIs & pregnancy. Highly effective methods include daily pills, implants (3-5 yrs), & IUDs. Double protect for safety!"
    },
    {
      keys: ['sti', 'std', 'hiv', 'aids', 'burning', 'discharge'],
      ans: "🩺 STIs & HIV: Symptoms include unusual discharge or burning, but many have 0 symptoms. Get tested. PrEP prevents HIV; PEP is for 72hr emergencies."
    },
    {
      keys: ['puberty', 'body change', 'changes', 'acne', 'voice', 'wet dream'],
      ans: "✨ Puberty: Bumps, voice crack, hair, and wet dreams are natural signs of hormonal growth. Focus on daily water hygiene and gentle care."
    }
  ];

  for (const match of keywords) {
    const hasMatch = match.keys.some(key => lowerMessage.includes(key));
    if (hasMatch) return match.ans;
  }

  return "YouthConnect Health: I hear you! For health guides, reply with 'period', 'contraception', 'STIs', or 'puberty'. For emergencies, call 911/112.";
}

module.exports = router;
