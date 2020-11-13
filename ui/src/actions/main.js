import {
  signDachTransferPermit,
  signDaiCheque,
  signChaiCheque,
  signSwap,
  signDaiConvert,
  signChaiConvert,
  batchSignData,
  getDaiChequeWithPermitData,
  setTxMinedInterval
} from '../utils/web3Utils';


import {
    relayParams,
    relay
  } from '../utils/rocksideAPI';



import {
  daiCheque,
  daiPermitAndCheque,
  chaiCheque,
  chaiPermitAndCheque,
  daiSwap,
  daiPermitAndSwap,
  chaiSwap,
  chaiPermitAndSwap,
  daiConvert,
  daiPermitAndConvert,
  chaiConvert,
  chaiPermitAndConvert
} from '../utils/apiUtils';

import config from '../config.json';

export const newDaiTransfer = async function() {
    const { store } = this.props
    const dachApproved = store.get('dach.daiApproved')

    

    store.set('cheque.requesting', true)

       console.log(dachApproved);
    //if (!dachApproved) {
        try {

            const params = await relayParams.bind(this)()
            console.log(params.speeds.fastest.relayer);
        
            store.set('relayer', params.speeds.fastest.relayer)
           
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'dai')
            try {
                // metamask race condition

                store.set('cheque.networkRequesting', true)

                setTimeout(async () => {
                    const signedCheque = await signDaiCheque.bind(this)()

                   
                    await getDaiChequeWithPermitData.bind(this)(signedPermit, signedCheque)
                    const data = store.get('withPermit.daiCheque')

        
                    // POST /permit_and_transfer

                    /*const web3 = store.get('web3')

                    await web3.eth.sendTransaction({
                        from: store.get('walletAddress'),
                        to: config.WITH_PERMIT,
                        data: data
                    }, function(error, hash){
                        console.log(error)
                       console.log(hash)
                    });*/

                   

                    /*const result = await daiPermitAndCheque({
                        permit: signedPermit,
                        cheque: signedCheque
                    })*/

                    const relayResponse = await relay.bind(this)(data)
                    console.log(relayResponse);

                    //store.set('cheque.result', result)
                    store.set('cheque.requesting', false)
                    store.set('cheque.networkRequesting', false)
                    /*if (result.success === 'true' && result.message.chequeHash) {
                        setTxMinedInterval('cheque', result.message.chequeHash, store)
                    }*/
                    // console.log('daiPermitAndCheque', result)
                }, 30)
            } catch(e) {
                // console.log(e)
                store.set('cheque.requesting', false)
                store.set('cheque.networkRequesting', false)
            }
        } catch(e) {
            // console.log(e)
            store.set('cheque.requesting', false)
        }
    /*} else {
        try {
            const signedCheque = await signDaiCheque.bind(this)()
            // console.log('signedCheque', signedCheque)
            // POST /transfer
            store.set('cheque.networkRequesting', true)
            const result = await daiCheque({ cheque: signedCheque })
            store.set('cheque.result', result)
            store.set('cheque.requesting', false)
            store.set('cheque.networkRequesting', false)
            if (result.success === 'true' && result.message.chequeHash) {
                setTxMinedInterval('cheque', result.message.chequeHash, store)
            }
        } catch(e) {
            // console.log('cheque error', e)
            store.set('cheque.requesting', false)
            store.set('cheque.networkRequesting', false)
        }
    }*/
}

export const newChaiTransfer = async function() {
    const { store } = this.props
    const dachApproved = store.get('dach.chaiApproved')

    store.set('cheque.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'chai')
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedCheque = await signChaiCheque.bind(this)()
                    // POST /permit_and_transfer
                    store.set('cheque.networkRequesting', true)
                    const result = await chaiPermitAndCheque({
                        permit: signedPermit,
                        cheque: signedCheque
                    })
                    store.set('cheque.result', result)
                    store.set('cheque.requesting', false)
                    store.set('cheque.networkRequesting', false)
                    if (result.success === 'true' && result.message.chequeHash) {
                        setTxMinedInterval('cheque', result.message.chequeHash, store)
                    }
                    // console.log('chaiPermitAndCheque', result)
                }, 10)
            } catch(e) {
                // console.log(e)
                store.set('cheque.requesting', false)
                store.set('cheque.networkRequesting', false)
            }
        } catch(e) {
            // console.log(e)
            store.set('cheque.requesting', false)
        }
    } else {
        try {
            const signedCheque = await signChaiCheque.bind(this)()
            // console.log('signedCheque', signedCheque)
            // POST /transfer
            store.set('cheque.networkRequesting', true)
            const result = await chaiCheque({ cheque: signedCheque })
            store.set('cheque.result', result)
            store.set('cheque.requesting', false)
            store.set('cheque.networkRequesting', false)
            if (result.success === 'true' && result.message.chequeHash) {
                setTxMinedInterval('cheque', result.message.chequeHash, store)
            }
        } catch(e) {
            // console.log('cheque error', e)
            store.set('cheque.requesting', false)
            store.set('cheque.networkRequesting', false)
        }
    }
}

export const newDaiSwap = async function() {
    const { store } = this.props
    const dachApproved = store.get('dach.daiApproved')
    store.set('swap.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'dai')
            try {
                // metamask race condition
                setTimeout(async () => {
                  const signedSwap = await signSwap.bind(this)()
                  store.set('swap.networkRequesting', true)
                  const result = await daiPermitAndSwap({
                      permit: signedPermit,
                      swap: signedSwap
                  })
                  store.set('swap.result', result)
                  store.set('swap.requesting', false)
                  store.set('swap.networkRequesting', false)
              }, 10)
            } catch(e) {
                // console.log(e)
                store.set('swap.requesting', false)
                store.set('swap.networkRequesting', false)
            }
        } catch(e) {
            // console.log(e)
            store.set('swap.requesting', false)
        }
    } else {
        try {
            const signedSwap = await signSwap.bind(this)()
            // console.log('signedSwap', signedSwap)
            store.set('swap.networkRequesting', true)
            const result = await daiSwap({ swap: signedSwap })
            store.set('swap.result', result)
            store.set('swap.requesting', false)
            store.set('swap.networkRequesting', false)
            if (result.success === 'true' && result.message.swapHash) {
                setTxMinedInterval('swap', result.message.swapHash, store)
            }
        } catch(e) {
            // console.log('swap error', e)
            store.set('swap.requesting', false)
            store.set('swap.networkRequesting', false)
        }
    }
}

export const newChaiSwap = async function() {
    const { store } = this.props
    const dachApproved = store.get('dach.chaiApproved')
    store.set('swap.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'chai')
            try {
                // metamask race condition
                setTimeout(async () => {
                  const signedSwap = await signSwap.bind(this)()
                  store.set('swap.networkRequesting', true)
                  const result = await chaiPermitAndSwap({
                      permit: signedPermit,
                      swap: signedSwap
                  })
                  store.set('swap.result', result)
                  store.set('swap.requesting', false)
                  store.set('swap.networkRequesting', false)
                  if (result.success === 'true' && result.message.swapHash) {
                      setTxMinedInterval('swap', result.message.swapHash, store)
                  }
              }, 10)
            } catch(e) {
                // console.log(e)
                store.set('swap.requesting', false)
                store.set('swap.networkRequesting', false)
            }
        } catch(e) {
            // console.log(e)
            store.set('swap.requesting', false)
        }
    } else {
        try {
            const signedSwap = await signSwap.bind(this)()
            // console.log('signedSwap', signedSwap)
            store.set('swap.networkRequesting', true)
            const result = await chaiSwap({ swap: signedSwap })
            store.set('swap.result', result)
            store.set('swap.requesting', false)
            store.set('swap.networkRequesting', false)
            if (result.success === 'true' && result.message.swapHash) {
                setTxMinedInterval('swap', result.message.swapHash, store)
            }
        } catch(e) {
            // console.log('swap error', e)
            store.set('swap.requesting', false)
            store.set('swap.networkRequesting', false)
        }
    }
}

export const newDaiConvert = async function() {
    const { store } = this.props

    const dachApproved = store.get('dach.daiApproved')

    store.set('convert.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'dai')
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedConvert = await signDaiConvert.bind(this)()
                    // POST /permit_and_transfer
                    store.set('convert.networkRequesting', true)
                    const result = await daiPermitAndConvert({
                        permit: signedPermit,
                        join: signedConvert
                    })
                    store.set('convert.result', result)
                    store.set('convert.requesting', false)
                    store.set('convert.networkRequesting', false)
                    if (result.success === 'true' && result.message.joinHash) {
                        setTxMinedInterval('convert', result.message.joinHash, store)
                    }
                }, 10)
            } catch(e) {
                // console.log(e)
                store.set('convert.requesting', false)
                store.set('convert.networkRequesting', false)
            }
        } catch(e) {
            // console.log(e)
            store.set('convert.requesting', false)
        }
    } else {
        try {
            const signedConvert = await signDaiConvert.bind(this)()

            // POST /transfer
            store.set('convert.networkRequesting', true)
            const result = await daiConvert({ join: signedConvert })
            store.set('convert.result', result)
            store.set('convert.requesting', false)
            store.set('convert.networkRequesting', false)
            if (result.success === 'true' && result.message.joinHash) {
                setTxMinedInterval('convert', result.message.joinHash, store)
            }
        } catch(e) {
            // console.log('cheque error', e)
            store.set('convert.requesting', false)
            store.set('convert.networkRequesting', false)
        }
    }
}

export const newChaiConvert = async function() {
    const { store } = this.props

    const dachApproved = store.get('dach.chaiApproved')

    store.set('convert.requesting', true)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true, 'chai')
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedConvert = await signChaiConvert.bind(this)()
                    // POST /permit_and_transfer
                    store.set('convert.networkRequesting', true)
                    const result = await chaiPermitAndConvert({
                        permit: signedPermit,
                        exit: signedConvert
                    })
                    store.set('convert.result', result)
                    store.set('convert.requesting', false)
                    store.set('convert.networkRequesting', false)
                    if (result.success === 'true' && result.message.exitHash) {
                        setTxMinedInterval('convert', result.message.exitHash, store)
                    }
                }, 10)
            } catch(e) {
                // console.log(e)
                store.set('convert.requesting', false)
                store.set('convert.networkRequesting', false)
            }
        } catch(e) {
            // console.log(e)
            store.set('convert.requesting', false)
        }
    } else {
        try {
            const signedConvert = await signChaiConvert.bind(this)()

            // POST /transfer
            store.set('convert.networkRequesting', true)
            const result = await chaiConvert({ exit: signedConvert })
            store.set('convert.result', result)
            store.set('convert.requesting', false)
            store.set('convert.networkRequesting', false)
            if (result.success === 'true' && result.message.exitHash) {
                setTxMinedInterval('convert', result.message.exitHash, store)
            }
        } catch(e) {
            // console.log('cheque error', e)
            store.set('convert.requesting', false)
            store.set('convert.networkRequesting', false)
        }
    }
}

export default {
}
