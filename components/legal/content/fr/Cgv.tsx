import { DocBody, DocHeader, Section } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CGV_META = {
  title: "Conditions Générales de Vente",
  version: "1",
  effectiveDate: "22/10/2026",
};
export default function Cgv() {
  return (
    <article className="space-y-8">
      <DocHeader {...CGV_META} locale="fr" />
      <DocBody>
        <Section title="1. Objet">
          <p>
            Les présentes Conditions Générales de Vente (CGV) précisent les conditions
            dans lesquelles Laboon propose ses services à titre onéreux, le cas échéant.
          </p>
        </Section>
        <Section title="2. Un service gratuit">
          <p>
            Dans sa version actuelle, l&apos;application Laboon et l&apos;ensemble de ses
            fonctionnalités sont gratuits. Aucun abonnement, achat intégré ni publicité
            n&apos;est proposé : aucune somme n&apos;est due par l&apos;Utilisateur et
            aucune donnée de paiement n&apos;est collectée.
          </p>
          <p>
            Les conditions d&apos;utilisation du service gratuit figurent dans les
            Conditions Générales d&apos;Utilisation et la Charte de bonne conduite.
          </p>
        </Section>
        <Section title="3. Offres payantes futures">
          <p>
            Si Laboon propose un jour une offre payante, ses prix, sa durée, ses modalités
            de paiement, de résiliation et de rétractation seront décrits dans de
            nouvelles CGV. L&apos;Utilisateur sera informé dans l&apos;application et
            invité à les accepter avant toute souscription : aucune offre payante ne
            s&apos;applique sans cette acceptation.
          </p>
        </Section>
        <Section title="4. Droit applicable et juridiction">
          <p>
            Les présentes CGV sont régies par le droit français. En cas de litige, et à
            défaut de résolution amiable, les tribunaux compétents du ressort de Lyon
            seront saisis.
          </p>
        </Section>
        <Section title="5. Contact">
          <p>
            Pour toute question relative aux présentes CGV :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
