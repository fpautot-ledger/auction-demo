import { useState } from 'react';
import constate from "constate";

export function useSettings() {

  const [settings,setState] = useState({
    network  : 'hangzhounet',
    endpoint : 'https://rpc.hangzhounet.teztnets.xyz',
    contract : 'KT1T9G1q8z42N27nQYURAqNRq86XzMyU6UEK',
    show     : false,
  });

  const setNetwork = (nw) => { setState((s) => {
      return { ...s, network: nw };
    });
  }

  const setEndpoint = (ep) => { setState((s) => {
      return { ...s, endpoint: ep };
    });
  }

  const setContract = (c) => { setState((s) => {
      return { ...s, contract: c };
    });
  }

  const hideSettings = () => { setState((s) => {
      return { ...s, show: false };
    })
  }

  const showSettings = () => { setState((s) => {
      return { ...s, show: true };
    })
  }

  const getBcdUrl = () => {
    return 'https://better-call.dev/' + settings.network + '/' + settings.contract;

  }

  return { settings, setNetwork, setEndpoint, setContract, hideSettings, showSettings, getBcdUrl };
}

export const [SettingsProvider, useSettingsContext] = constate(useSettings);

export const appName = "My First Completium DApp"

// fonts
export const courier = "Courier Prime, monospace";
export const alegreya = "Alegreya Sans SC, sans-serif";
