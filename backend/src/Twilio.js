const twilio = require("twilio");
const VoiceResponse = require("twilio/lib/twiml/VoiceResponse");

class Twilio {
  phoneNumber = "+1 888 508 3174";
  phoneNumberSid = "PN80b96fde73d5e52993556e6d52dc740e";
  tokenSid = "SKb0177fcf8d9d449d11f3631b7bae6de8";
  tokenSecret = "fXGN4x0INUOvxca6wqA4DhniCxqpNiP1";
  accountSid = "AC9f0d5779df39874ae482c3e04e1695ec";
  verify = "VA1aea703dfe0760a153a01480bf8b4390";
  outgoingApplicationSid = "APa6f537b76c8303bf77d7fd442a4f4107";
  client;
  constructor() {
    this.client = twilio(this.tokenSid, this.tokenSecret, {
      accountSid: this.accountSid,
    });
  }
  getTwilio() {
    this.client;
  }

  async sendVerifyAsync(to, channel) {
    const data = await this.client.verify
      .services(this.verify)
      .verifications.create({
        to,
        channel,
      });
    // console.log("sendVerify");
    return data;
  }

  async verifyCodeAsync(to, code) {
    const data = await this.client.verify
      .services(this.verify)
      .verificationChecks.create({
        to,
        code,
      });
    console.log("verifyCode");
    return data;
  }

  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: "female",
      },
      message
    );
    twiml.redirect("https://fifty-terms-roll.loca.lt/enqueue");
    return twiml;
  }

  enqueueCall(queueName) {
    const twiml = new VoiceResponse();
    twiml.enqueue(queueName);
    return twiml;
  }

  redirectCall(client) {
    const twiml = new VoiceResponse();
    twiml.dial().client(client);
    return twiml;
  }

  answerCall(sid) {
    console.log("answerCall with sid", sid);
    this.client.calls(sid).update({
      url: "https://fifty-terms-roll.loca.lt/connect-call",
      method: "POST",
      function(err, call) {
        console.log("anwserCall", call);
        if (err) {
          console.error("anwserCall", err);
        }
      },
    });
  }

  getAccessTokenForVoice = (identity) => {
    console.log(`Access token for ${identity}`);
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    const outgoingAppSid = this.outgoingApplicationSid;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingAppSid,
      incomingAllow: true,
    });
    const token = new AccessToken(
      this.accountSid,
      this.tokenSid,
      this.tokenSecret,
      { identity }
    );
    token.addGrant(voiceGrant);
    console.log("Access granted with JWT", token.toJwt());
    return token.toJwt();
  };
}

const instance = new Twilio();
Object.freeze(instance);

module.exports = instance;
