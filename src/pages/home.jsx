import BottomBar from '@/components/home/bottom-bar';
import ContentTabs from '@/components/home/content-tabs';
import CurrentNFTCarousel from '@/components/home/current-nft-carousel';
import NavBar from '@/components/home/search-bar';
import WalletWidget from '@/components/home/wallet';
import TradingViewWidget from '@/components/btcusd-widget';
import React, { useEffect, useState } from 'react';
import Announcement from '@/components/announcement';
import BannerCarousel from '@/components/home/banner-carousel';
import Timer from '@/components/Timer';
import { Copy, Key, Loader } from 'lucide-react';
import PurchasedNFTCarousel from '@/components/home/purchased-nft-carousel';
import requestApi from '@/service/service';
import Swal from 'sweetalert2';

const Home = ({ }) => {
    const [data, setData] = useState('')
    const [currentNFTList, setCurrentNFTList] = useState('')
    const [TradeList, setTradeList] = useState('')
    const [purchasedNFTList, setPurchasedNFTList] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchDashboard()
        fetchCurrentNFT()
        fetchPurchasedNFT()
    }, [])

    const fetchDashboard = async () => {
        setLoading(true)
        const response = await requestApi.dashboard()
        if (response.status === 200) {
            setData(response.data)
            setTradeList(response.data)
        }
        setLoading(false)
    }

    const fetchCurrentNFT = async () => {
        setLoading(true)
        const response = await requestApi.currentNFT()
        if (response.status === 200) {
            setCurrentNFTList(response.data.data)
        }
        setLoading(false)
    }
    const fetchPurchasedNFT = async () => {
        setLoading(true)
        const body = { PageNumber: 1, PageSize: 10 }
        const response = await requestApi.purchasedNFT(body)
        if (response.status === 200) {
            setPurchasedNFTList(response.data.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (data) {
            if (data.fundWallet < 50) {
                Swal.fire({
                    title: "Warning",
                    text: "Fund balance is low for NFT Trading",
                    icon: "error"
                });
            } else if (data.noTrade <= 0) {
                Swal.fire({
                    title: "Warning",
                    text: "Today limit reached for trading",
                    icon: "error"
                });
            }
        }
    }, [data])

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <Loader className="animate-spin text-emerald-500" size={50} />
        </div>
    }

    return (
        <div className="relative flex flex-col overflow-scroll">
            <NavBar />
            <BannerCarousel />
            <div className="grid grid-cols-2 gap-3 p-4">
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Total Earnings</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.totalEarnings)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Today All Earnings</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.todayEarnings)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Today NFT Profit</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.todayTrading)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Today Investment</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.todayInvestment)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Wallet Balance</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.fundWallet)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Withdraw Balance</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.incomeWallet)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                    </div>
            <WalletWidget data={data} />
            <Announcement />
            {TradeList.noTrade <= 0 && TradeList.status === "Active" ? (
                <Timer />
            ) : (
                <CurrentNFTCarousel currentNFTList={currentNFTList} />
            )}
            <PurchasedNFTCarousel purchasedNFTList={purchasedNFTList} />
            <ContentTabs data={data} />
        </div>
    );
};

export default Home;
