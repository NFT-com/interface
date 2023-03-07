import { Doppler, getEnv } from './env';

export enum DeploymentEnv {
  DEBUG='DEBUG',
  SANDBOX='SANDBOX',
  STAGING='STAGING',
  PRODUCTION='PRODUCTION'
}

/**
 * Gets the deployment environment. Note: Defaults to `DEBUG` environment if doppler returns undefined.
 * @returns {DeploymentEnv} The deployment environment.
 */
export const getDeployEnv = () => (getEnv(Doppler.NEXT_PUBLIC_ENV) as DeploymentEnv) || DeploymentEnv.DEBUG;

/**
 * Returns whether or not the current deployment is a production deployment.
 * @returns {boolean} - whether or not the current deployment is a production deployment.
 */
export const isProd: boolean = getDeployEnv() === DeploymentEnv.PRODUCTION;

/**
 * Returns whether the current deployment environment is the development environment.
 * @returns {boolean} - whether the current deployment environment is the development environment.
 */
export const isDev: boolean = getDeployEnv() === DeploymentEnv.DEBUG;
