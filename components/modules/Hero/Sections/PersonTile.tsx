import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image, { StaticImageData } from 'next/image';
import defaultLogo from 'public/default_user.svg';
import linkedInIcon from 'public/linkedin_icon.svg';
import twitterIcon from 'public/twitter_icon.svg';
import { ExternalLink } from 'styles/theme/Components';

export type Person = {
  name: string,
  bioItems: string[],
  pictureUrl: StaticImageData,
  twitterUrl: string,
  linkedInUrl: string
}

export interface PersonTileProps {
  person: Person,
  direction: string
}

export function PersonTile(props: PersonTileProps) {
  const { person, direction } = props;
  return (
    <div
      key={person.name}
      className={tw('mb-10 mx-2.5 w-full deprecated_minmd:mb-16',
        'deprecated_minxs2:mb-8 deprecated_minxl:px-0 shrink-0',
        'deprecated_minsm:max-w-[45rem] deprecated_minsm:mx-auto'
      )}
    >
      {/* image + header */}
      <div className={tw('flex items-center relative pt-56 deprecated_minsm:pt-0  deprecated_minsm:items-start',
        direction === 'left' ? 'flex-row-reverse' : 'flex-row pt-56',
        direction === 'left' ? 'deprecated_minsm:pr-72' : 'deprecated_minsm:pl-72'
      )}>
        { <Image
          className={tw('absolute top-0 w-52 h-52 rounded-full transform',
            'deprecated_minmd:w-64 deprecated_minmd:h-64',
            direction === 'left' ? 'deprecated_minsm:right-0' : 'deprecated_minsm:left-0'
          )}
          alt={person.name}
          src={!person?.pictureUrl ?
            defaultLogo :
            person.pictureUrl}
        /> }
        <div className="flex-shrink">
          <div className={tw('relative z-20 text-hero-pink font-hero-heading1',
            'break-normal text-4xl deprecated_minsm:text-[2.5rem]',
            'bottom-0 left-0 max-w-[50%]',
            direction === 'left' ? 'deprecated_minsm:-right-16' : ''
          )}>
            {person.name}
          </div>
          {/* bio points */}
          <ul className={tw('list-disc mt-4',
            direction === 'left' ? '' : 'w-[85%]'
          )}>
            {person.bioItems.map((item, index) => {
              return (
                <li
                  key={index} className={tw(
                    'mt-2 text-lg leading-relaxed font-medium text-grey-txt')}>
                  {item}
                </li>
              );
            })}
          </ul>

          {/* Links */}
          <div className='flex flex-col ml-2'>
            <div className="flex flex-row mt-4 w-full items-center">
              {!isNullOrEmpty(person.linkedInUrl) &&
                <ExternalLink href={person.linkedInUrl}>
                  <Image
                    className={tw('w-8 deprecated_minlg:w-6 cursor-pointer flex shrink-0')}
                    src={linkedInIcon}
                    alt="linkedIn Link"
                  />
                </ExternalLink>
              }
              {!isNullOrEmpty(person.twitterUrl) &&
                <ExternalLink href={person.twitterUrl}>
                  <Image
                    className={tw('w-8 deprecated_minlg:w-6 cursor-pointer flex shrink-0 ml-5')}
                    src={twitterIcon}
                    alt="twitter link"
                  />
                </ExternalLink>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
