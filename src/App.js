import './App.css';
import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

import { DAppProvider } from './dappstate';
import { SnackProvider } from './snackstate';
import { appName, alegreya, courier } from './settings';
import Snack from './components/Snack';
import WalletButton from './components/WalletButton';
import { SettingsPanel } from './components/Settings';

import { TezosToolkit } from '@taquito/taquito';
import { SettingsProvider, useSettingsContext } from './settings.js';
import { useState } from 'react';

import Button from '@material-ui/core/Button';
import { useTezos, useAccountPkh } from './dappstate';
import { useSnackContext } from './snackstate';
import { UnitValue } from '@taquito/taquito';

const Cell = (props) => {
  return (<Grid item xs={6}><Typography align="left" variant="subtitle2"
    style={ props.data ? { fontFamily: courier } : { } }> { props.val }
  </Typography></Grid>)
}

const address = "KT1NNh22LhAuzEvsWnd596qmSbwbVWUDk41X"
const tokenid = 0
const amount = 10
const sell_price = 1

const SellButton = () => {

  const tezos = useTezos();
  const account = useAccountPkh();
  const { settings } = useSettingsContext();
  const { setInfoSnack, setErrorSnack, hideSnack } = useSnackContext();
  const bid = async () => {
    try {
      const contract  = await tezos.wallet.at(settings.contract);
      const operation = await contract.methods.list_nft(tokenid, address, sell_price).send();
      const shorthash = operation.opHash.substring(0, 10) + "...";
      setInfoSnack(`waiting for ${ shorthash } to be confirmed ...`);
      await operation.receipt();
      hideSnack();
    } catch (error) {
      console.log(error)
      setErrorSnack(error.message);
      setTimeout(hideSnack, 4000);
    }
  }
  return (
    <Button onClick={ bid } variant="outlined" disabled={ account === null }>
      List NFT for sale
    </Button>);
}

const BidButton = () => {
  const tezos = useTezos();
  const account = useAccountPkh();
  const { settings } = useSettingsContext();
  const { setInfoSnack, setErrorSnack, hideSnack } = useSnackContext();
  const bid = async () => {
    try {
      const contract  = await tezos.wallet.at(settings.contract);
      const operation = await contract.methods.bid(tokenid, address, 1).send({ amount: amount });
      const shorthash = operation.opHash.substring(0, 10) + "...";
      setInfoSnack(`waiting for ${ shorthash } to be confirmed ...`);
      await operation.receipt();
      hideSnack();
    } catch (error) {
      setErrorSnack(error.message);
      setTimeout(hideSnack, 4000);
    }
  }
  return (
    <Button onClick={ bid } variant="outlined" disabled={ account === null }>
      post bid
    </Button>);
}

const ClaimButton = () => {
  const { settings } = useSettingsContext();
  const tezos = useTezos();
  const account = useAccountPkh();
  const { setInfoSnack, setErrorSnack, hideSnack } = useSnackContext();
  const claim = async () => {
    try {
      const contract  = await tezos.wallet.at(settings.contract);
      const operation = await contract.methods.claim(tokenid, address).send();
      const shorthash = operation.opHash.substring(0, 10) + "...";
      setInfoSnack(`waiting for ${ shorthash } to be confirmed ...`);
      await operation.receipt();
      hideSnack();
    } catch (error) {
      setErrorSnack(error.message);
      setTimeout(hideSnack, 4000);
    }
  }
  return (
    <Button onClick={ claim } variant="outlined" disabled={ account === null }>
      Claim
    </Button>);
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  return (
    <DAppProvider appName={ appName }>
      <SettingsProvider>
      <SnackProvider>
      <ThemeProvider theme={ theme }>
      <CssBaseline />
      <div className="App">
        <Container style={{ marginTop: 50 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <SellButton />
            </Grid>
            <Grid item xs={12}>
                <BidButton />
            </Grid>
            <Grid item xs={12}>
                <ClaimButton />
            </Grid>
            <Grid item xs={12}>
                <WalletButton />
            </Grid>
          </Grid>
        </Container>
      </div>
      <SettingsPanel/>
      <Snack />
      </ThemeProvider>
      </SnackProvider>
      </SettingsProvider>
    </DAppProvider>
  );
}

export default App;