import "./test-setup";
import loader from "./loader";

describe('testing api loader', () => {

  test('startheaderinfo', async () => {
    const startHeaderInfo = await loader.startHeaderInfo();

    console.log("startheaderInfo", startHeaderInfo);


    expect(startHeaderInfo.status).toEqual("0");
    expect(startHeaderInfo.msg).toEqual("OK");

    const resp = startHeaderInfo.response;
    expect(resp).not.toBeNull();
    expect(resp.region).toEqual("mexico");
    expect(resp.HKS).not.toBeNull();
    expect(resp.session_parametername).toEqual("HKS");
  });

  test('apaMetadata', async () => {
    const apaMetadata = await loader.apaMetadata();

    expect(apaMetadata).not.toBeNull();

  });

  test('apaAsset', async () => {
    const apaAsset = await loader.apaAsset();

    expect(apaAsset).not.toBeNull();

  });

  test('apaLauncher', async () => {
    const apaLauncher = await loader.apaLauncher();

    console.log(apaLauncher);

    expect(apaLauncher.status).toEqual("0");
    expect(apaLauncher.msg).toEqual("OK");

    const resp = apaLauncher.response;
    expect(apaLauncher).not.toBeNull();
    expect(apaLauncher.akamai_mfwk).not.toBeNull();

  });

  test('anonymous isLoggedIn', async () => {
    const isLoggedIn = await loader.isLoggedIn();

    console.log(isLoggedIn);

    expect(isLoggedIn.status).toEqual("1");
    expect(isLoggedIn.msg).toEqual("ERROR");

    const resp = isLoggedIn.response;
    const isUserLoggedIn = !!resp.is_user_logged_in;
    expect(resp.is_user_logged_in).toBeFalsy();
  });

  test('smartCardLogin', async () => {
    const smartCardLogin = await loader.smartCardLogin();

    console.log(smartCardLogin);
    expect(smartCardLogin.status).toEqual("1");
    expect(smartCardLogin.msg).toEqual("ERROR");
    expect(smartCardLogin.response).toBeNull();

    // const resp = smartCardLogin.response.data;
    // const isUserLoggedIn = !!resp.is_user_logged_in;
    // expect(resp.is_user_logged_in).toBeFalsy();
  });

});
