import { useNavigate } from "@solidjs/router";
import { Switch, Match, Show, createSignal, createEffect, DEV } from "solid-js";
import {
  hasConnectedToAccessPoint,
  runDevice,
  updateConfig,
  fetchConfig,
} from "../api";

function StartingUpMessage(props) {
  return (
    <div class="col-lg-12 -mb-5 my-auto mx-auto">
      Your device is connecting to the WiFi network. This may take a few
      seconds.
      <br />
      If your device isn't online in <strong>
        {props.counter} seconds
      </strong>{" "}
      please try reconfiguinging your wifi; and double check the name and
      password.
      <br />
      <b>SSID: {props.ssid}</b>
      <br />
      <b>IP Address: {props.ip}</b>
    </div>
  );
}

function ConnectToAPMessage() {
  return (
    <div class="col-lg-12 -mb-5 my-auto mx-auto">
      In order to configure your device, please connect to the device's Access
      Point:
      <br />
      <b>SSID: Arduino WiFi Config AP</b>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [config, setConfig] = createSignal();
  const [state, setState] = createSignal("initial");
  const [counter, setCounter] = createSignal(60);

  async function updateConfigClick(e) {
    e.preventDefault();

    const response = await updateConfig(config());
    console.log(response);
  }

  async function runDeviceClick(e) {
    e.preventDefault();
    setCounter(60);

    function dropCounter() {
      if (counter() > 1) {
        setCounter(counter() - 1);
        setTimeout(dropCounter, 1000);
      }
    }
    setTimeout(dropCounter, 1000);
    setState("starting");
    await runDevice();
  }

  async function loadConfig() {
    try {
      setConfig(await fetchConfig());
      setState("connected");
    } catch (e) {
      console.log("Error Loading Config: ", e);
    }
  }

  function onConfigChange(key, value) {
    console.log("onConfigChange", key, value);
    setConfig({ ...config(), [key]: value });
  }

  return (
    <>
      <div class="my-auto col-lg-12 -mb-5 my-auto mx-auto">
        <div class="alert alert-danger font-weight-bold" role="alert">
          UNDER ACTIVE DEVELOPMENT
        </div>
        <h1>CONFIGURE ARDUINO WIFI</h1>
        <button
          class="w-100 my-3 btn-info btn"
          onClick={() => loadConfig(false)}
        >
          + LOAD CONFIG FROM ARDUINO +
        </button>
        <Switch fallback={<div>LOADING</div>}>
          <Match when={state() === "starting"}>
            <StartingUpMessage
              ssid={config().ssid}
              ip={config().ip}
              counter={counter}
            />
          </Match>
          <Match when={state() === "initial"}>
            <ConnectToAPMessage />
          </Match>
          <Match when={state() === "connected"}>
            <form>
              <div class="mb-2 form-group">
                <input
                  type="text"
                  class="form-control"
                  id="ssid"
                  placeholder="Enter WiFi SSID"
                  value={config().ssid || ""}
                  onKeyUp={(e) => onConfigChange("ssid", e.target.value)}
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter WiFi Password"
                  value={config().password || ""}
                  onKeyUp={(e) => onConfigChange("password", e.target.value)}
                />
              </div>
              <div class="mb-2 form-group">
                <input
                  type="text"
                  class="form-control"
                  id="ip"
                  placeholder="Enter IP Address for Static IP"
                  value={config().ip || ""}
                  onKeyUp={(e) => onConfigChange("ip", e.target.value)}
                />
              </div>
              <button
                class="w-100 my-3 btn-info btn"
                onClick={updateConfigClick}
              >
                + UPDATE WIFI CONFIG +
              </button>
              <button
                onClick={runDeviceClick}
                class="w-100 py-2 my-2 btn btn-danger"
              >
                + SAVE CHANGES AND CONNECT +
              </button>
            </form>
          </Match>
        </Switch>
      </div>
    </>
  );
}
