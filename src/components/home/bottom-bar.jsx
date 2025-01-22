import { BellDot, CreditCard, HandCoins, Home, ShoppingCart, Menu, NotebookIcon, RefreshCcw, Wallet } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomBar = ({ }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-around items-center bg-app-bg-secondary p-2">
            <div className="flex flex-col gap-2 items-center text-xs">
                <Home size={20} className="text-app-text-primary" />
                <div>Home</div>
            </div>
            <div className="flex flex-col gap-2 items-center text-xs">
                <HandCoins size={20} onClick={() => navigate('/nft-list/Buy', { state: { title: 'Buy' } })} />
                <div>Buy</div>
            </div>
            <div className="flex flex-col gap-2 items-center text-xs">
                <ShoppingCart size={20} onClick={() => navigate('/nft-list/Sell', { state: { title: 'Sell' } })} />
                <div>Sell</div>
            </div>
            <div className="flex flex-col gap-2 items-center text-xs">
                <Menu size={20} onClick={() => navigate('/sidebar', { state: { title: 'Menu' } })} />
                <div>Menu</div>
            </div>
        </div>
    );
};

export default BottomBar;
