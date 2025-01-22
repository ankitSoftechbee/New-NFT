import requestApi from '@/service/service';
import { ShoppingCart, HelpingHand } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const Operation = () => {
    const routParams = useParams()
    const [operationName, setOperationName] = useState('')
    const [walletBalance, setWalletBalance] = useState('')

    const [nftId, setNftId] = useState('')
    const [data, setData] = useState('')

    useEffect(() => {
        if (routParams) {
            fetchWalletBalance()
            setOperationName(routParams.operationName)
            setNftId(routParams.nftID)
            if (routParams.operationName === 'Buy') {
                fetchBuyPackage(routParams.nftID)
            } else {
                fetchSellPackage(routParams.nftID)
            }
        }
    }, [routParams])

    const fetchWalletBalance = async () => {
        const response = await requestApi.getWalletBalance()
        if (response && response.data.fundBalance) {
            setWalletBalance(response.data)
        } else {
            setWalletBalance('')
        }
    }

    const fetchBuyPackage = async (id) => {
        const body = { RID: id }
        const response = await requestApi.getBuyPackageById(body)
        if (response.status === 200) {
            setData(response.data)
        }

    }
    const fetchSellPackage = async (id) => {
        const body = { RID: id }
        const response = await requestApi.getSellPackageById(body)
        // console.log(response)
        if (response.status === 200) {
            setData(response.data)
        }
    }

    const handleClick = async (id) => {
        if (operationName === 'Buy') {
            const body = {
                "packname": data.name,
                "buyAmount": walletBalance?.fundBalance,
                "sellAmount": data.sellAmount,
                "profitAmount": data.profitAmount,
                "img": data.img,
                "remark": data.remark
            }

            const response = await requestApi.buyPackage(body)
            if (response.status === 200) {
                toast.success('Buy Successfully')
                Swal.fire({
                    title: "Success",
                    text: "NFT Purchased Successfully At : $" + walletBalance?.fundBalance,
                    icon: "success"
                });
                fetchWalletBalance();

            } else {
                toast.error('Buy Failed: Today limit reached')
            }
        } else if (operationName === 'Sell') {
            const body = {
                "rid": data.rid,
            }
            const response = await requestApi.sellPackage(body)
            if (response.status === 200) {
                toast.success('Sell Successfully')
                const Profit = parseFloat(data.buyAmount) + parseFloat(data.profitAmount)

                Swal.fire({
                    title: "Success",
                    text: "NFT Sold At : $" + Profit + ", Profit : $" + parseFloat(data.profitAmount),
                    icon: "success"
                });

                fetchWalletBalance()

            } else {
                toast.error('Already Selled')
            }
        } else {
            toast.error('Invalid Request')
        }

    }


    return <div>
        <nav class="flex" aria-label="Breadcrumb" className='mt-2 mb-4'>
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center">
                    <a href="#" class="inline-flex items-center text-lg font-bold text-white-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        {operationName === 'Buy' ? <> <ShoppingCart className="w-6 h-6 mr-2" /> / BUY</> : <> <HelpingHand className="w-6 h-6 mr-2" /> / SELL </>}
                    </a>
                </li>
            </ol>
        </nav>

        <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg">
            <div className="flex justify-between items-center">
                <div className="text-yellow-500">Fund Balance = {walletBalance?.fundBalance || '0'} USDT</div>
            </div>
        </div>

        <div className='bg-[#1d1d1f] p-2 rounded-md'>
            <img src={data?.img || ''} className='w-[100%] h-[180px]' />
        </div>
        <div className='bg-[#1d1d1f] mt-6 p-2 rounded-md'>
            <div className="relative flex flex-col gap-2 rounded-lg">
                <div className="w-full">
                    <div
                        className="flex justify-between gap-3 items-center text-sm bg-[#242427]/50 p-4 border-purple-500/30 border rounded-lg text-yellow-100 overflow-hidden"
                    >
                        <div className="flex  items-center gap-2">
                            <div className="text-nowrap text-neutral-400">NFT Name</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-nowrap text-white font-medium">{data?.name || data?.packType || ''}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex flex-col gap-2 rounded-lg mt-2">
                <div className="w-full">
                    <div
                        className="flex justify-between gap-3 items-center text-sm bg-[#242427]/50 p-4 border-purple-500/30 border rounded-lg text-yellow-100 overflow-hidden"
                    >
                        <div className="flex  items-center gap-2">
                            <div className="text-nowrap text-neutral-400">Item Price</div>
                        </div>
                        <div className="flex items-center gap-2">
                            {operationName === 'Buy' && (
                                <div className="text-nowrap text-green-700 font-medium">
                                    ${data?.buyAmount || ''} - ${data?.sellAmount || ''}
                                </div>
                            )}
                            {operationName === 'Sell' && (
                                <div className="text-nowrap text-green-700 font-medium">
                                    ${data?.buyAmount || ''}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex flex-col gap-2 rounded-lg mt-2">
                <div className="w-full">
                    <div
                        className="flex justify-between gap-3 items-center text-sm bg-[#242427]/50 p-4 border-purple-500/30 border rounded-lg text-yellow-100 overflow-hidden"
                    >

                        <div className="flex items-center gap-2">
                            {operationName === 'Buy' && (
                                <>
                                    <div className="flex  items-center gap-2">
                                        <div className="text-nowrap text-neutral-400">Profit (%)</div>
                                    </div>
                                </>
                            )}
                            {operationName === 'Sell' && (
                                <div className="flex  items-center gap-2">
                                    <div className="text-nowrap text-neutral-400">Profit ($)</div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">

                            {operationName === 'Buy' && (
                                <div className="flex  items-center gap-2">
                                    <div className="text-nowrap text-green-700 font-medium"> {data?.profitAmount || ''}%</div>
                                </div>
                            )}
                            {operationName === 'Sell' && (
                                <div className="flex  items-center gap-2">
                                    <div className="text-nowrap text-green-700 font-medium"> ${data?.profitAmount || ''}</div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex flex-col gap-2 rounded-lg mt-2">
                <div className="w-full">
                    <div
                        className="flex justify-between gap-3 items-center text-sm bg-[#242427]/50  border-purple-500/30 border rounded-lg text-yellow-100 overflow-hidden"
                    >
                        <button
                            type="submit"
                            className="w-full p-2 rounded-full 
                                            bg-gradient-to-r from-[#f539f8] via-[#c342f9] to-[#5356fb]
                                            transition-all duration-300 
                                            active:scale-[0.98]
                                            disabled:opacity-50 disabled:cursor-not-allowed m-2"
                            onClick={() => handleClick(operationName === 'Buy' ? data.packid : data.rid)}
                        >
                            {operationName}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Operation