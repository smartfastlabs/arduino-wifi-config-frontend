import { useNavigate } from "@solidjs/router";
import { Switch, Match, Show, createSignal, createEffect } from "solid-js";
import {
  hasConnectedToAccessPoint,
  runDevice,
  updateConfig,
  fetchConfig,
} from "../api";

function StartingUpMessage(props) {
  return <div>Starting Up: {props.counter()} seconds remaining.</div>;
}

function StartArduinoMessage() {}

function ConnectToAPMessage() {
  return (
    <div class="content col-lg-12 container vh-100 -mb-5 my-auto mx-auto">
      In order to configure your device, please connect to the device's WiFi.{" "}
      <br />
      SSID: quickping.io access point
    </div>
  );
}

export default function NewDevice() {
  const navigate = useNavigate();
  const [config, setConfig] = createSignal();
  const [state, setState] = createSignal("initial");
  const [counter, setCounter] = createSignal(0);

  async function updateConfigClick(e) {
    e.preventDefault();

    const response = await updateConfig(config());
    console.log(response);
  }

  async function runDeviceClick(e) {
    e.preventDefault();
    setTimeout(() => {
      setState("running");
    }, 10000);
    setCounter(10);

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
    <div class="content col-lg-12 container vh-100 -mb-5 my-auto mx-auto">
      <h1>CONFIGURE DEVICE</h1>
      <button class="w-100 my-3 btn-info btn" onClick={() => loadConfig(false)}>
        + CONNECT TO ARDUINO +
      </button>
      <Switch fallback={<div>LOADING</div>}>
        <Match when={state() === "starting"}>
          <StartingUpMessage counter={counter} />
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
            <button class="w-100 my-3 btn-info btn" onClick={updateConfigClick}>
              + UPDATE WIFI CONFIG +
            </button>
            <button
              onClick={runDeviceClick}
              class="w-100 py-2 my-2 btn btn-danger"
            >
              Connect to Wifi
            </button>
          </form>
        </Match>
      </Switch>
    </div>
  );
}
