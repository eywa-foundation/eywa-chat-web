# Eywa Chat Web

This is a web client for Eywa. There are two ways to use this client:

1. Use with blockchain only
2. Use with relay server

## Project setup

```
yarn
yarn dev
```

## Build

due to lack of support to TypeScript, build with `vite build` manually.

```
yarn run vite build
```

## Usage

1. install Keplr extension and create a new account.
2. if needed, send some tokens to the account. If there's no sufficient tokens,
   the account cannot register, make chat rooms and send messages with the blockchain.
3. open the web client and connect to the blockchain. (Click Starts with Wallet)
4. Create Chat Room with opponent's wallet address.
   You can choose which blockchain to use, or which relay server to use.
5. Join the chat room.
6. Send messages
   If you use blockchain,
   you need to sign the message with Keplr extension every time you send a message.
   If you use relay server,
   you don't need to sign the message, but you need to pay some fee to the relay server.

## How it works

Before use this client, in chat web client, you need to register your wallet
address and public key which is used to encrypt the messages.  
The public key is stored in the blockchain and the wallet address is used to
identify the user. And the private key is stored in web browser's local storage.
This key is used to decrypt the messages. So Eywa garantees that the messages
are encrypted and only the user can read the messages. (End-to-end encryption)

Eywa uses `handshake` process to establish a connection between two peers.
In this process, one peer determines which server to use (blockchain or relay server)
and transacts with the blockchain to handshake with another peer.

### Blockchain only

After the handshake, the peers can communicate with each other directly with the blockchain.
The blockchain is used to store the messages and the peers can read the messages from the blockchain.
Since the blockchain is a public ledger, anyone can read the messages. But the messages are encrypted,
so only the peers can read the messages. The sender knows the plain text of the message,
so the sender uses itselves, and the sender uses the receiver's public key to
encrypt message and finally the receiver uses the it owns private key to decrypt the message.

With Blockchain way, the peers use pooling to read the messages. The pooling interval is 1 second.
So the peers can read the messages after 1 second from the message is sent.

### Relay server

After the handshake, the peers can communicate with each other through the relay server.
This promotes the speed of the communication. As the blockchain way does, the relay server
also guarantees the end-to-end encryption. The relay server is used to send the message
faster than the blockchain way.

With Relay server way, the peers use websocket to read the messages. So the peers can read
the messages immediately after the message is sent.
