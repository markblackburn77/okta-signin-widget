import { RequestMock, RequestLogger } from 'testcafe';
import SuccessPageObject from '../framework/page-objects/SuccessPageObject';
import ChallengeCustomAppPushPageObject from '../framework/page-objects/ChallengeCustomAppPushPageObject';
import { checkConsoleMessages } from '../framework/shared';

import pushPoll from '../../../playground/mocks/data/idp/idx/authenticator-verification-custom-app-push';
import pushPollReject from '../../../playground/mocks/data/idp/idx/authenticator-verification-custom-app-push-reject';
import success from '../../../playground/mocks/data/idp/idx/success';
import pushPollAutoChallenge from '../../../playground/mocks/data/idp/idx/authenticator-verification-custom-app-push-autochallenge';
const logger = RequestLogger(/challenge|challenge\/poll|authenticators\/poll/,
  {
    logRequestBody: true,
    stringifyRequestBody: true,
  }
);

const pushSuccessMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(pushPoll)
  .onRequestTo('http://localhost:3000/idp/idx/challenge/poll')
  .respond(success);

const pushRejectMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(pushPoll)
  .onRequestTo('http://localhost:3000/idp/idx/challenge/poll')
  .respond(pushPollReject)
  .onRequestTo('http://localhost:3000/idp/idx/challenge')
  .respond(pushPoll);

const pushWaitMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(pushPoll)
  .onRequestTo('http://localhost:3000/idp/idx/challenge/poll')
  .respond(pushPoll);

const pushAutoChallengeMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(pushPollAutoChallenge);

const pushWaitAutoChallengeMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(pushPollAutoChallenge)
  .onRequestTo('http://localhost:3000/idp/idx/authenticators/poll')
  .respond(pushPollAutoChallenge);

fixture('Challenge Custom App Push');

async function setup(t) {
  const challengeCustomAppPushPageObject = new ChallengeCustomAppPushPageObject(t);
  await challengeCustomAppPushPageObject.navigateToPage();
  return challengeCustomAppPushPageObject;
}

test
  .requestHooks(pushSuccessMock)('challenge custom app push screen has right labels', async t => {
    const challengeCustomAppPushPageObject = await setup(t);
    await checkConsoleMessages({
      controller: 'mfa-verify',
      formName: 'challenge-poll',
      authenticatorKey: 'custom_app',
      methodType: 'push',
    });

    const pageTitle = challengeCustomAppPushPageObject.getPageTitle();
    const pushBtn = challengeCustomAppPushPageObject.getPushButton();
    const a11ySpan = challengeCustomAppPushPageObject.getA11ySpan();
    await t.expect(pushBtn.textContent).contains('Push notification sent');
    await t.expect(a11ySpan.textContent).contains('Push notification sent');
    await t.expect(pushBtn.hasClass('link-button-disabled')).ok();
    await t.expect(pageTitle).contains('Verify with Custom Push');

    // Verify links
    await t.expect(await challengeCustomAppPushPageObject.switchAuthenticatorLinkExists()).ok();
    await t.expect(challengeCustomAppPushPageObject.getSwitchAuthenticatorLinkText()).eql('Verify with something else');
    await t.expect(await challengeCustomAppPushPageObject.signoutLinkExists()).ok();
    await t.expect(challengeCustomAppPushPageObject.getSignoutLinkText()).eql('Back to sign in');
  });

test
  .requestHooks(pushAutoChallengeMock)('challenge custom app push screen has right labels, custom logo and auto challenge checkbox', async t => {
    const challengeCustomAppPushPageObject = await setup(t);
    await checkConsoleMessages({
      controller: 'mfa-verify',
      formName: 'challenge-poll',
      authenticatorKey: 'custom_app',
      methodType: 'push',
    });

    const pageTitle = challengeCustomAppPushPageObject.getPageTitle();
    const pushBtn = challengeCustomAppPushPageObject.getPushButton();
    const a11ySpan = challengeCustomAppPushPageObject.getA11ySpan();
    const checkboxLabel = challengeCustomAppPushPageObject.getAutoChallengeCheckboxLabel();
    const logoClass = challengeCustomAppPushPageObject.getBeaconClass();
    await t.expect(pushBtn.textContent).contains('Push notification sent');
    await t.expect(a11ySpan.textContent).contains('Push notification sent');
    await t.expect(pushBtn.hasClass('link-button-disabled')).ok();
    await t.expect(logoClass).contains('custom-logo');
    await t.expect(pageTitle).contains('Verify with Atko Corp Authenticator OV FFs off test');
    await t.expect(checkboxLabel.hasClass('checked')).ok();
    await t.expect(checkboxLabel.textContent).eql('Send push automatically');

    // unselect checkbox on click
    await challengeCustomAppPushPageObject.clickAutoChallengeCheckbox();
    await t.expect(checkboxLabel.hasClass('checked')).notOk();

    // Verify links
    await t.expect(await challengeCustomAppPushPageObject.switchAuthenticatorLinkExists()).ok();
    await t.expect(challengeCustomAppPushPageObject.getSwitchAuthenticatorLinkText()).eql('Verify with something else');
    await t.expect(await challengeCustomAppPushPageObject.signoutLinkExists()).ok();
    await t.expect(challengeCustomAppPushPageObject.getSignoutLinkText()).eql('Back to sign in');
    
  });

test
  .requestHooks(logger, pushSuccessMock)('challenge Custom App push request', async t => {
    await setup(t);
    const successPage = new SuccessPageObject(t);
    const pageUrl = await successPage.getPageUrl();
    await t.expect(pageUrl)
      .eql('http://localhost:3000/app/UserHome?stateToken=mockedStateToken123');
    await t.expect(logger.count(() => true)).eql(1);

    const { request: {
      body: answerRequestBodyString,
      method: answerRequestMethod,
      url: answerRequestUrl,
    }
    } = logger.requests[0];
    const answerRequestBody = JSON.parse(answerRequestBodyString);
    await t.expect(answerRequestBody).eql({
      stateHandle: '02XxswQHZqCz4aWbqQFNXYRC4HHoqd76NBC-FIGbbH'
    });
    await t.expect(answerRequestMethod).eql('post');
    await t.expect(answerRequestUrl).eql('http://localhost:3000/idp/idx/challenge/poll');
  });

test
  .requestHooks(logger, pushWaitMock)('challenge Custom App push polling', async t => {
    await setup(t);
    await t.wait(4000);
    await t.expect(logger.count(() => true)).eql(1);

    const { request: {
      body: answerRequestBodyString,
      method: answerRequestMethod,
      url: answerRequestUrl,
    }
    } = logger.requests[0];
    const answerRequestBody = JSON.parse(answerRequestBodyString);
    await t.expect(answerRequestBody).eql({
      stateHandle: '02XxswQHZqCz4aWbqQFNXYRC4HHoqd76NBC-FIGbbH'
    });
    await t.expect(answerRequestMethod).eql('post');
    await t.expect(answerRequestUrl).eql('http://localhost:3000/idp/idx/challenge/poll');

    await t.wait(3000); // 7 sec total elapsed
    await t.expect(logger.count(() => true)).eql(1);

    await t.wait(1000); // 8 sec total elapsed
    await t.expect(logger.count(() => true)).eql(2);

    const { request: {
      method: answerRequestMethod2,
      url: answerRequestUrl2,
    }
    } = logger.requests[1];    
    await t.expect(answerRequestMethod2).eql('post');
    await t.expect(answerRequestUrl2).eql('http://localhost:3000/idp/idx/challenge/poll');
  });

test
  .requestHooks(logger, pushWaitAutoChallengeMock)('Call Custom App push polling and checkbox should be clickable after polling started', async t => {
    const challengeCustomAppPushPageObject = await setup(t);
    const checkboxLabel = challengeCustomAppPushPageObject.getAutoChallengeCheckboxLabel();
    await t.expect(await challengeCustomAppPushPageObject.autoChallengeInputExists()).ok();
    await t.expect(checkboxLabel.hasClass('checked')).ok();
    await t.expect(checkboxLabel.textContent).eql('Send push automatically');

    await setup(t);
    await t.wait(4000);
    await t.expect(logger.count(() => true)).eql(1);

    const { request: {
      body: answerRequestBodyString,
      method: answerRequestMethod,
      url: answerRequestUrl,
    }
    } = logger.requests[0];
    const answerRequestBody = JSON.parse(answerRequestBodyString);
    await t.expect(answerRequestBody).eql({
      autoChallenge: true,
      stateHandle: '02TcECA1PvSpQTx8Zqo08SSYj88KsXxwNKV4PGvVpF~MWN5ZTdqYzFpaVg0alUwSytEMllSLzNyaVZ6b0wyMFA0Y2hqRUpOTDcrNk02anZZaTM3bitSNFk1NHNtTmgyakw3bjNpVDVjNXRtd0xMQ1U3Q0JWbFRlNnlIYnYyMDRycThJNCtOcm9XRzEydnpvN3I3RFNmS1I2TTQzdFRIdmU5dTRDc1hRWnpONmtET1RvTlFGNHhBTko3T3E2YnIxTjM1RUg3OTExdlhLSDNwQTVMZEpNblZxaGh1b04zc2xtQk05ajVTUGdVeTdYVWtzTllPRHNubFp3U2x6VWFwRFRWOUM4aVRqK1VibnNhQVUxVktJeGtsb21TZks5NHFEM2ZrMW9IU3p5RGZveWxvbElVS1QrR1VJRjNVUHU0bUpCRCtYNXphbGZpL0tpTjAzUHRaVGg4NXBuNUJVa1cwd0JnNEpiNmdzYUpMY2tFZS8wZjdIV2VGdEJvcGxmMnlMRGRvQWV2RElvTUtQK0plaTZMMk16MkRpL2p1T2Fncldxa2ZkQ1lwWUxhUVZhTDVoVml5T242UlU1c0JOc0s0UFZOMmtaQXNsVlRMQWxvd1lKb1BsZzNkVVRXYWQ1d3NrS1RudVBxV2NvQXc4OThiMEpyeWxEb3BXVXRRSWtrblY0ZlZyMTd5bGhrY1RtWGNkTVhNK2ZaQU00VDVtRDBONGpTbmxEaTU0WEloeW04ZlZFM2dSRHNPclhlTnJZdVMrNUt1UnhOMEIvRnUvVFRvWVlESGdJcDdGZDlLMGFIeTFva0tFZFJrajloK0c3a0ZqZVkwUEUxTWNGVm5iTGkxVDVSNnlNNTBOSWZvNGF6MlpwMWlFc1hGVkl2a2RoaWJFdTZVTXczMGJRYjQvRDF4MXhxbjJkUVRKdHUxQ0xtZWZhU3VwbTl5NlNRQi9UN0JOL2xaWjBaZVJXSDgvVnRicjREL0QybzFiNlBoZCtOYys0bDNIUmxCbVJUSC94TFVrQkpTS1Nad2NPVzN4eHJxWGp4TlJWWTNYb3JIUWFEZHBvL2czQ1FWMFdBQUVrTlpSeXFWelJBTGdLWm81RVAvQ2xHQldYR29NVWk2WT0'
    });
    await t.expect(answerRequestMethod).eql('post');
    await t.expect(answerRequestUrl).eql('http://localhost:3000/idp/idx/authenticators/poll');

    await t.wait(3000); // 7 sec total elapsed
    await t.expect(logger.count(() => true)).eql(1);

    await t.wait(1000); // 8 sec total elapsed
    await t.expect(logger.count(() => true)).eql(2);

    const { request: {
      method: answerRequestMethod2,
      url: answerRequestUrl2,
    }
    } = logger.requests[1];    
    await t.expect(answerRequestMethod2).eql('post');
    await t.expect(answerRequestUrl2).eql('http://localhost:3000/idp/idx/authenticators/poll');

    // unselect checkbox on click to ensure its still accessbile while polling
    await challengeCustomAppPushPageObject.clickAutoChallengeCheckbox();
    await t.expect(checkboxLabel.hasClass('checked')).notOk();
  });
  

test
  .requestHooks(logger, pushRejectMock)('challenge Custom App reject push and then resend', async t => {
    const challengeCustomAppPushPageObject = await setup(t);
    const errorBox = challengeCustomAppPushPageObject.getErrorBox();
    await t.expect(errorBox.innerText)
      .eql('You have chosen to reject this login.');
    await t.expect(challengeCustomAppPushPageObject.form.getSaveButtonLabel())
      .eql('Resend push notification');
    await t.expect(logger.count(() => true)).eql(1);
    
    // To make sure polling stops after reject
    await t.wait(5000);
    await t.expect(logger.count(() => true)).eql(1);
    
    await challengeCustomAppPushPageObject.clickNextButton();
    await t.expect(logger.count(() => true)).eql(2);
    
    const { request: {
      body: requestBodyString,
      method: requestMethod,
      url: requestUrl,
    }
    } = logger.requests[1];
    const requestBody = JSON.parse(requestBodyString);
    await t.expect(requestBody).eql({
      authenticator: {
        id: 'aut198w4v0f8dr8gT0g4',
        methodType: 'push'
      },
      stateHandle: '02jScqx_dpaclG7Hury1J4J2qS2B_bltQte8eCSQUe'
    });
    await t.expect(requestMethod).eql('post');
    await t.expect(requestUrl).eql('http://localhost:3000/idp/idx/challenge');
  });

test
  .requestHooks(pushWaitMock)('Warning callout appears after 30 seconds', async t => {
    const challengeCustomAppPushPageObject = await setup(t);
    await t.wait(10000);
    await t.expect(challengeCustomAppPushPageObject.getWarningBox().length).eql(0);
    await t.wait(20100); // Total > 30s
    const warningBox = challengeCustomAppPushPageObject.getWarningBox();
    await t.expect(warningBox.innerText)
      .eql('Haven\'t received a push notification yet? Try opening Custom Push on your phone.');
  });
