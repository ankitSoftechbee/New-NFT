import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import metaBullApi from '@/api/game-app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import requestApi from '@/service/service';
import Swal from 'sweetalert2';




const Withdraw = () => {
    const [availableBalance, setAvailableBalance] = useState('')

    // const [selectedMode, setSelectedMode] = useState(null);

    // API Hooks
    // const [withdrawMutation] = metaBullApi.useWithdrawMutation();
    // const { data: paymentModes, isLoading: modesLoading, isFetching: modesFetching, isError: modesIsError, error: modesError } = metaBullApi.usePaymentModeQuery();
    // const { data: walletBalance, isLoading: wbLoading, isFetching: wbFetching, isError: wbIsError, error: wbError } = metaBullApi.useGetWalletBalanceQuery();
    // const { data: walletAddress, isFetching, isLoading } = metaBullApi.useDepositAddressQuery({ mode: selectedMode }, { skip: !selectedMode });
    // const { data: wallet, isLoading: userWalletLoading, isFetching: userWalletFetching } = metaBullApi.useGetWalletAddressQuery();

    useEffect(() => {
        fetchWallet()
        fetchWalletBalance()
    }, [])
    const fetchWallet = async () => {
        const response = await requestApi.getWalletAddress()
        if (response.status === 200) {
            formik.setFieldValue('wallet', response.data.usdtWallet)
        }
    }

    const fetchWalletBalance = async () => {
        const response = await requestApi.getWalletBalance()
        if (response && response.data.withdrawBalance) {
            setAvailableBalance(response.data)
        } else {
            setAvailableBalance('')
        }
    }

    const formik = useFormik({
        initialValues: {
            amount: '',
            paymentMode: 'USDT',
            wallet: '',
            paidAmount: '',
            transPassword: '',
        },
        validationSchema: Yup.object().shape({
            amount: Yup.number()
                .typeError('Amount must be a valid number') // Ensures the input is a number
                .positive('Amount must be greater than zero') // Ensures it's a positive number
                .min(50, 'Minimum amount should be 50') // Minimum amount constraint
                .max(availableBalance?.withdrawBalance, 'Amount exceeds available balance') // Maximum constraint based on fund balance
                .required('Amount is required'),
            paidAmount: Yup.number().required('Paid Amount is required'),
            transPassword: Yup.string().required('Transaction Password is required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const Balance = availableBalance?.withdrawBalance;

            const remainingBalance = Balance - parseFloat(values.amount);

            // Check if remaining balance is less than or equal to 50
            if (remainingBalance <= 50) {
                toast.dismiss(); // Dismiss any active toasts

                // Show confirmation SweetAlert
                const confirm = await toast.promise(
                    new Promise((resolve, reject) => {
                        Swal.fire({
                            title: "Warning",
                            text: "Your ID will be Blocked as Your Available Balance is going to become <= 50. Do you want to proceed?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, Proceed",
                            cancelButtonText: "No, Cancel",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                resolve(true); // User confirmed
                            } else {
                                reject(false); // User canceled
                            }
                        });
                    }),
                    {
                        loading: "Processing your decision...",
                        success: "Confirmed",
                        error: "Cancelled",
                    }
                );

                if (!confirm) {
                    setSubmitting(false);
                    return; // Cancel withdrawal
                }
            }

            // Proceed with withdrawal
            const response = await requestApi.updateWithdraw(values);
            if (response.status === 200) {
                toast.success("Withdrawal successful");
                resetForm();

            } else {
                toast.error("Withdrawal failed");
            }

            setSubmitting(false);
        },
    });


    return (
        <>
            <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white mb-4">Withdraw</h2>
                    <div className="text-yellow-500">Available Balance = {availableBalance?.withdrawBalance || '0'} USDT</div>

                </div>

                {/* Withdraw Form */}

                <form onSubmit={formik.handleSubmit} className="space-y-4 bg-[#2a2a2c] p-6 rounded-2xl border border-emerald-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white mb-2">Amount (USDT)</label>
                            <Input
                                name="amount"
                                type="number"
                                placeholder="Enter Amount"
                                className="bg-[#1d1d1f] border-emerald-500/20"
                                value={formik.values.amount}
                                onChange={e => {
                                    const amount = e.target.value;
                                    formik.setFieldValue('amount', amount);
                                    formik.setFieldValue('paidAmount', (amount * 0.95).toString());

                                }}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.amount && formik.touched.amount && <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Payment mode</label>
                            <Input name="paymentMode" type="text" placeholder="Payment mode" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.paymentMode} readOnly />
                            {formik.errors.paymentMode && formik.touched.paymentMode && <div className="text-red-500 text-sm mt-1">{formik.errors.paymentMode}</div>}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Wallet</label>
                            <Input name="wallet" type="text" placeholder="wallet" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.wallet} readOnly />
                            {formik.errors.wallet && formik.touched.wallet && <div className="text-red-500 text-sm mt-1">{formik.errors.wallet}</div>}
                        </div>

                        <div>
                            <label className="block text-white mb-2">Final Amount</label>
                            <Input name="paidAmount" type="number" placeholder="Paid Amount" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.paidAmount} readOnly />
                            {formik.errors.paidAmount && formik.touched.paidAmount && <div className="text-red-500 text-sm mt-1">{formik.errors.paidAmount}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-white mb-2">Transaction Password</label>
                        <Input
                            name="transPassword"
                            type="password"
                            placeholder="Enter Transaction Password"
                            className="bg-[#1d1d1f] border-emerald-500/20"
                            value={formik.values.transPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.errors.transPassword && formik.touched.transPassword && <div className="text-red-500 text-sm mt-1">{formik.errors.transPassword}</div>}
                    </div>

                    <Button type="submit" disabled={formik.isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                        {formik.isSubmitting ? 'Processing...' : 'Submit Withdrawal'}
                    </Button>
                </form>

            </div>
            <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg mt-5 text-neutral-400">
                <h2 className="font-semibold text-red-600 mb-4">Points to remember</h2>
                <ol className="list-disc ml-3">
                    <li>A 5% withdrawal fee will be applied to each withdrawal transaction.</li>
                </ol>
            </div>
        </>
    );
};

export default Withdraw;
