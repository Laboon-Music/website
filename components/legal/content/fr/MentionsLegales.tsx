import { DocBody, DocHeader, List, Section } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const MENTIONS_LEGALES_META = {
  title: "Mentions Légales",
  version: "2",
  effectiveDate: "12/10/2026",
};
export default function MentionsLegales() {
  return (
    <article className="space-y-8">
      <DocHeader {...MENTIONS_LEGALES_META} locale="fr" />
      <p className="max-w-[62ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-muted">
        Conformément aux articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la
        Confiance dans l&apos;Économie Numérique (LCEN).
      </p>
      <DocBody>
        <Section title="1. Éditeur de l'application">
          <List>
            <li>
              <strong>Nom et prénom</strong> : Lopez Mathieu
            </li>
            <li>
              <strong>Adresse</strong> : 3 Rue du Colonel Sebanne 69600 Oullins
            </li>
            <li>
              <strong>Email de contact</strong> :{" "}
              <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
            </li>
            <li>
              <strong>Hébergeur</strong> : OVH SAS, 2 rue Kellermann, 59100 Roubaix,
              France
            </li>
          </List>
        </Section>
        <Section title="2. Propriété intellectuelle">
          <p>
            L&apos;ensemble des éléments constituant l&apos;application Laboon (nom, logo,
            charte graphique, contenus, logiciels) est protégé par les lois françaises et
            internationales relatives à la propriété intellectuelle.
          </p>
          <p>
            La marque « Laboon » est déposée auprès de l&apos;INPI sous les classes Nice
            9, 35 et 41. Toute reproduction ou utilisation sans autorisation préalable est
            interdite.
          </p>
        </Section>
        <Section title="3. Liens hypertextes">
          <p>
            Laboon ne peut être tenu responsable du contenu des sites tiers vers lesquels
            des liens pourraient pointer depuis l&apos;application ou le site web.
          </p>
        </Section>
        <Section title="4. Droit applicable">
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de
            litige, les tribunaux compétents sont du ressort de Lyon.
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
