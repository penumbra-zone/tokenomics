import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = {
  docs: [
    { label: "Protocol Spec", href: "https://protocol.penumbra.zone/" },
    { label: "Penumbra Guide", href: "https://guide.penumbra.zone/" },
    { label: "Blog", href: "https://penumbra.zone/blog" },
  ],
  explore: [
    { label: "Home Page", href: "https://penumbra.zone/" },
    { label: "App", href: "https://app.penumbra.zone/" },
    { label: "Prax Wallet", href: "https://praxwallet.com/" },
    { label: "Veil DEX", href: "https://dex.penumbra.zone/" },
  ],
};

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/penumbra-zone",
    icon: "/github-icon.svg",
  },
  {
    name: "Discord",
    href: "https://discord.gg/hKvkrqa3zC",
    icon: "/discord-icon.svg",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/penumbrazone",
    icon: "/twitter-icon.svg",
  },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Image
              src="/penumbra-logo-center.svg"
              alt="Penumbra Logo"
              width={120}
              height={24}
              style={{ height: 'auto' }}
              className="mb-4"
            />
            <p className="text-neutral-400 text-sm leading-relaxed">
              A fully private proof-of-stake network and decentralized exchange for the Cosmos
              ecosystem.
            </p>
          </div>

          {/* Docs Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Docs</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.docs.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Penumbra Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore Penumbra</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={`${social.name} icon`}
                    width={20}
                    height={20}
                    className="opacity-70 hover:opacity-100 transition-opacity duration-200 filter brightness-0 invert"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Penumbra Labs. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-neutral-500 hover:text-neutral-400 text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-neutral-500 hover:text-neutral-400 text-sm transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
