import { Facebook, Instagram, Youtube } from 'lucide-react';
import type { ComponentType } from 'react';

type IconProps = { className?: string };

function TikTokIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks: Array<{
  href: string;
  label: string;
  Icon: ComponentType<IconProps>;
}> = [
  { href: 'https://www.instagram.com/vocal_u', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.tiktok.com/@vocalumn', label: 'TikTok', Icon: TikTokIcon },
  { href: 'https://www.youtube.com/@vocal-u', label: 'YouTube', Icon: Youtube },
  { href: 'https://www.facebook.com/vocaluacappella/', label: 'Facebook', Icon: Facebook },
];

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
};

export function SocialLinks({
  className = '',
  linkClassName = '',
  iconClassName = 'h-4 w-4',
}: SocialLinksProps) {
  return (
    <div className={className}>
      {socialLinks.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          aria-label={`Vocal U on ${label}`}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
