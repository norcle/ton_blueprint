import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';
import {Base64} from 'js-base64';


export type HelloWorldConfig = {};

export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell().endCell();
}

export class HelloWorld implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HelloWorld(address);
    }

    static createFromConfig(config: HelloWorldConfig, code: Cell, workchain = 0) {
        const data = helloWorldConfigToCell(config);
        const init = { code, data };
        return new HelloWorld(contractAddress(workchain, init), init);
    }

    async getHelloWorld(provider: ContractProvider) {
        const { stack } = await provider.get('hello_world', [])
        const number = stack.readBigNumber();
        
        console.log(decode16(number.toString(16)))
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}

function decode16(hex = ''){
    const result = []
    for (let i = 0; i < hex.length; i += 2) {
      result.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)))
    }
    return result.join('')
}

function toHex (char = '') {
    return char.charCodeAt(0).toString(16)
  }

function encode16 (str = '') {
    return str.split('').map(toHex).join('')
}