import { getEnvBool, Secret } from 'utils/getEnv';

import ReactGA from 'react-ga';
import { WalletSubTab } from 'types';

export enum LoggingCategory {
  Wallet = 'Wallet',
  Bid = 'Bid',
  Approve = 'Approve',
  TopProfiles = 'Top Profiles',
  UserDetail = 'User Detail',
  Watchlist = 'Watchlist',
  AddFunds = 'Add Funds',
  CreateUser = 'Create User',
}

function logEvent(category: string, action: string, extras?: string) {
  if (getEnvBool(Secret.NEXT_PUBLIC_ENGAGEMENT_LOGGING_ENABLED)) {
    ReactGA.event({
      action: action,
      category: category,
      label: extras ?? '',
    });
  }
}

export function logOpenWalletSlide() {
  logEvent(LoggingCategory.Wallet, 'wallet_slide_impression');
}

export function logAddFundsLinkClick() {
  logEvent(LoggingCategory.AddFunds, 'add_funds_link_click');
}

export function logAddFundsModalImpression() {
  logEvent(LoggingCategory.AddFunds, 'add_funds_modal_impression');
}

export function logWatchlistToggleFailure() {
  logEvent(LoggingCategory.Watchlist, 'watchlist_toggle_failure');
}

export function logWatchlistToggleSuccess() {
  logEvent(LoggingCategory.Watchlist, 'watchlist_toggle_success');
}

export function logWatchlistRemoveClick() {
  logEvent(LoggingCategory.Watchlist, 'watchlist_remove_click');
}

export function logWatchlistAddClick() {
  logEvent(LoggingCategory.Watchlist, 'watchlist_add_click');
}

export function logDetailedWalletViewImpression(subtab: WalletSubTab) {
  switch (subtab) {
  case WalletSubTab.Watchlist:
    logEvent(LoggingCategory.UserDetail, 'user_detail_watchlist_impression');
    break;
  case WalletSubTab.Bids:
    logEvent(LoggingCategory.UserDetail, 'user_detail_bids_impression');
    break;
  case WalletSubTab.Profiles:
    logEvent(LoggingCategory.UserDetail, 'user_detail_profiles_impression');
    break;
  }
}

export function logTopProfilesImpression() {
  logEvent(LoggingCategory.TopProfiles, 'top_profiles_impression');
}

export function logApproveNftSuccess() {
  logEvent(LoggingCategory.Approve, 'approve_nft_tokens_success');
}

export function logApproveNftFailure() {
  logEvent(LoggingCategory.Approve, 'approve_nft_tokens_failure');
}

export function logApproveNftClick() {
  logEvent(LoggingCategory.Approve, 'approve_nft_tokens_click');
}

export function logBidFailure() {
  logEvent(LoggingCategory.Bid, 'submit_bid_failure');
}

export function logBidSuccess() {
  logEvent(LoggingCategory.Bid, 'submit_bid_success');
}

export function logBidSubmitClick(additional: boolean) {
  logEvent(LoggingCategory.Bid, 'submit_bid_click', JSON.stringify({ additional: additional }));
}

export function logBidButtonImpression() {
  logEvent(LoggingCategory.Bid, 'submit_bid_button_impression');
}

export function logNftTokenLPLinkClick() {
  logEvent(LoggingCategory.Bid, 'nft_token_lp_link_click');
}

export function logBidModalImpression() {
  logEvent(LoggingCategory.Bid, 'bid_modal_impression');
}

export function logChangeWallet(name: string) {
  logEvent(LoggingCategory.Wallet, 'change_wallet', JSON.stringify({ name: name }));
}

export function logEmailSubmitted() {
  logEvent(LoggingCategory.CreateUser, 'email_submitted');
}

export function logVerificationSuccess() {
  logEvent(LoggingCategory.CreateUser, 'email_verification_success');
}

export function logCreateUserSuccess() {
  logEvent(LoggingCategory.CreateUser, 'create_user_mutation_success');
}

export function logCreateUserFailure() {
  logEvent(LoggingCategory.CreateUser, 'create_user_mutation_failure');
}
