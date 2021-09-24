import { Injectable } from '@angular/core';
import {WcSdk} from "@cityofzion/wallet-connect-sdk-core/lib";
import { SessionTypes } from '@walletconnect/types'
import Client from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Injectable({
  providedIn: 'root'
})
export class WalletconnectService {

  wcClient: Client;

  constructor() 
  { 
    WcSdk.initClient(
      "debug", // logger: use debug to show all log information on browser console
      "wss://relay.walletconnect.org" // we are using walletconnect's official relay server
    ).then(result => 
      {
        console.log("client initiated");
        this.wcClient = result;
    });
  }

  connectWallet()
  {
    WcSdk.subscribeToEvents(this.wcClient, {
      onProposal: uri => {
        QRCodeModal.open(uri, () => { /* nothing */ })
      }
    });
    
    WcSdk.connect(this.wcClient, {
      chainId: "neo3:testnet", // blockchain and network identifier
      methods: ["invokefunction"], // which RPC methods do you plan to call
      appMetadata: {
        name: "MyApplicationName", // your application name to be displayed on the wallet
        description: "My Application description", // description to be shown on the wallet
        url: "https://myapplicationdescription.app/", // url to be linked on the wallet
        icons: ["https://myapplicationdescription.app/myappicon.png"], // icon to be shown on the wallet
      }
    })
  }
}
