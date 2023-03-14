'use client';
import { NFTListingsContextProvider } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchaseContextProvider } from 'components/modules/Checkout/NFTPurchaseContext';
import { NotificationContextProvider } from 'components/modules/Notifications/NotificationContext';
import { GraphQLProvider } from 'graphql/client/GraphQLProvider';

import { CryptoWalletProvider } from './CryptoWalletContext';

import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CryptoWalletProvider>
        <AnimatePresence mode="wait">
          <GraphQLProvider>
            <DndProvider backend={HTML5Backend}>
              <NotificationContextProvider>
                <NFTPurchaseContextProvider>
                  <NFTListingsContextProvider>
                    {children}
                  </NFTListingsContextProvider>
                </NFTPurchaseContextProvider>
              </NotificationContextProvider>
            </DndProvider>
          </GraphQLProvider>
        </AnimatePresence>
      </CryptoWalletProvider>
    </>
  );
};

export default RootProvider;
