
import { CheckCircle } from 'phosphor-react';

export interface CheckoutSuccessViewProps {
  userAddress: string;
}

export function CheckoutSuccessView(props: CheckoutSuccessViewProps) {
  console.log('props ', props.userAddress);
  
  return <div className="flex flex-col items-center">
    <CheckCircle size={60} className="text-green-500 mb-4" />
    <span className="text-lg">{props.userAddress}</span>
  </div>;
}