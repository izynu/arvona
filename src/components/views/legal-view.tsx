"use client";

import { site } from "@/data/site";

function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16">
      <header className="pt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{title}</h1>
        <p className="mt-2 font-mono text-xs text-fg-faint">Last updated {updated}</p>
      </header>
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  );
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-fg">{heading}</h2>
      <div className="mt-2.5 space-y-2.5 text-sm leading-relaxed text-fg-muted">{children}</div>
    </section>
  );
}

export function PrivacyView() {
  return (
    <LegalShell title="Privacy policy" updated={site.lastVerified}>
      <Block heading="Short version">
        <p>
          {site.name} has no accounts, no analytics, no ads, and no cookies. Nothing about you
          is collected, profiled, or transmitted to us, because there is no us-side server
          collecting it.
        </p>
      </Block>

      <Block heading="What is stored in your browser">
        <p>
          Two preferences are saved in your browser local storage and never leave your device:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-mono text-xs">arvona-theme</span>: your dark or light theme
            choice.
          </li>
          <li>
            <span className="font-mono text-xs">arvona-store-v1</span>: your saved resources and
            recently opened entries.
          </li>
        </ul>
        <p>
          Clearing your browser storage removes both. There is no cloud copy because there is no
          account.
        </p>
      </Block>

      <Block heading="Third parties">
        <p>
          Rows on this site link to external websites with their own privacy practices. Their
          policies apply once you leave this site.
        </p>
        <p>
          The site itself is served as static files from GitHub Pages. Requests to load the page
          are handled by GitHub infrastructure under GitHub&apos;s privacy policy; we do not
          receive or process those request logs.
        </p>
      </Block>

      <Block heading="Changes">
        <p>
          If this policy ever changes, the change will be described on this page with a new
          update date, and material changes will also appear in the release changelog.
        </p>
      </Block>

      <Block heading="Contact">
        <p>
          Privacy questions can be filed as an issue at{" "}
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg underline-offset-2 hover:text-brand hover:underline"
          >
            {site.repositoryUrl}
          </a>
          .
        </p>
      </Block>
    </LegalShell>
  );
}

export function TermsView() {
  return (
    <LegalShell title="Terms of use" updated={site.lastVerified}>
      <Block heading="Using this site">
        <p>
          {site.name} is a directory of links to free and open resources, provided as is, with
          no warranty of any kind. By using it you accept these terms.
        </p>
      </Block>

      <Block heading="External links">
        <p>
          We verify every link before listing it and print the verification date on each row,
          but third-party sites can change at any time. A link is not an endorsement of
          everything a destination publishes, and the maintainers are not responsible for
          external content. If a destination turns bad, report it with the flag icon and the
          entry will be reviewed.
        </p>
      </Block>

      <Block heading="Lawful use">
        <p>
          The catalog only lists things you can legally use for free, and you must still follow
          each resource&apos;s own license and terms. You agree not to use this site to find or
          distribute infringing copies of anything, and not to abuse the issue tracker with
          spam or harassment.
        </p>
      </Block>

      <Block heading="Ownership">
        <p>
          The site code is MIT licensed in the public repository. Catalog descriptions and the
          data export are dedicated to the public domain under CC0 1.0. Product names and
          trademarks at linked destinations belong to their respective owners.
        </p>
      </Block>

      <Block heading="Liability">
        <p>
          To the maximum extent permitted by law, the maintainers are not liable for any damage
          or loss resulting from use of this site or the resources it links to. Install and use
          third-party software at your own discretion.
        </p>
      </Block>

      <Block heading="Changes and contact">
        <p>
          These terms may be updated to reflect project changes; the update date above always
          shows the current version. Feedback and questions go through{" "}
          <a
            href={site.issuesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg underline-offset-2 hover:text-brand hover:underline"
          >
            GitHub issues
          </a>
          .
        </p>
      </Block>
    </LegalShell>
  );
}
