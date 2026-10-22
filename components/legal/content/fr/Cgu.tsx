import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CGU_META = {
  title: "Conditions Générales d'Utilisation",
  version: "1",
  effectiveDate: "22/10/2026",
};
export default function Cgu() {
  return (
    <article className="space-y-8">
      <DocHeader {...CGU_META} locale="fr" />
      <DocBody>
        <Section title="1. Objet">
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) définissent les
            modalités et conditions dans lesquelles Laboon met à disposition des
            utilisateurs son application mobile et ses services associés.
          </p>
          <p>
            Laboon est une application de mise en relation entre musiciens, permettant à
            des artistes de trouver des partenaires musicaux, former des groupes et
            collaborer.
          </p>
          <p>
            En créant un compte sur l&apos;application Laboon, vous acceptez sans réserve
            les présentes CGU.
          </p>
        </Section>
        <Section title="2. Définitions">
          <List>
            <li>
              <strong>« Laboon »</strong> : la plateforme, l&apos;application mobile et
              ses services, édités par Laboon.
            </li>
            <li>
              <strong>« Utilisateur »</strong> : toute personne physique majeure ayant
              créé un compte sur Laboon.
            </li>
            <li>
              <strong>« Profil »</strong> : la fiche personnelle de l&apos;Utilisateur
              comprenant ses informations musicales et de contact.
            </li>
            <li>
              <strong>« Contenu »</strong> : tout élément publié par l&apos;Utilisateur
              (texte, photo, liens audio/vidéo, messages).
            </li>
            <li>
              <strong>« Services »</strong> : l&apos;ensemble des fonctionnalités
              proposées par Laboon.
            </li>
          </List>
        </Section>
        <Section title="3. Accès aux services">
          <p>
            L&apos;accès aux Services est réservé aux personnes physiques majeures (18 ans
            et plus). En créant un compte, vous déclarez avoir au moins 18 ans.
          </p>
          <p>
            L&apos;application Laboon est disponible gratuitement sur App Store / Google
            Play. Si une offre payante est proposée plus tard, ses conditions feront
            l&apos;objet de CGV spécifiques, que vous serez invité à accepter.
          </p>
        </Section>
        <Section title="4. Création de compte">
          <p>
            Pour accéder aux Services, l&apos;Utilisateur doit créer un compte en
            fournissant des informations exactes, complètes et à jour. Chaque personne ne
            peut posséder qu&apos;un seul compte actif.
          </p>
          <p>
            L&apos;Utilisateur est seul responsable de la confidentialité de ses
            identifiants de connexion et de toute activité réalisée depuis son compte.
          </p>
          <p>
            Laboon se réserve le droit de suspendre ou supprimer tout compte créé avec de
            fausses informations ou utilisé de façon frauduleuse.
          </p>
        </Section>
        <Section title="5. Règles d'utilisation">
          <Subheading>L&apos;Utilisateur s&apos;engage à :</Subheading>
          <List>
            <li>
              Utiliser Laboon uniquement à des fins de mise en relation musicale et de
              collaboration artistique
            </li>
            <li>
              Fournir des informations véridiques sur son profil et ses compétences
              musicales
            </li>
            <li>Respecter les autres utilisateurs dans ses communications</li>
            <li>
              Ne pas utiliser la plateforme à des fins commerciales sans accord préalable
              de Laboon
            </li>
          </List>
          <Subheading>Il est strictement interdit de :</Subheading>
          <List>
            <li>
              Publier des contenus illicites, diffamatoires, obscènes, menaçants ou
              portant atteinte aux droits de tiers
            </li>
            <li>
              Usurper l&apos;identité d&apos;un autre musicien ou d&apos;un groupe
              existant
            </li>
            <li>Spammer d&apos;autres utilisateurs via la messagerie interne</li>
            <li>
              Utiliser des robots, scrapers ou tout outil automatisé pour accéder aux
              données
            </li>
            <li>Tenter de contourner les mesures de sécurité de la plateforme</li>
            <li>
              Reproduire, copier ou exploiter tout ou partie de la plateforme sans
              autorisation écrite
            </li>
          </List>
        </Section>
        <Section title="6. Contenus publiés par les utilisateurs">
          <p>
            L&apos;Utilisateur conserve la propriété intellectuelle sur les contenus
            qu&apos;il publie. En publiant sur Laboon, il concède à Laboon une licence non
            exclusive, mondiale, gratuite, permettant d&apos;afficher et distribuer ces
            contenus dans le cadre du fonctionnement du service.
          </p>
          <p>
            L&apos;Utilisateur garantit que les contenus publiés (notamment les extraits
            audio/vidéo) ne violent pas les droits de tiers.
          </p>
          <p>
            Laboon se réserve le droit de supprimer tout contenu qui violerait les
            présentes CGU, sans préavis.
          </p>
        </Section>
        <Section title="7. Messagerie et mise en relation">
          <p>
            La messagerie interne de Laboon est un outil de mise en relation musicale.
            Laboon n&apos;est pas partie aux échanges entre utilisateurs et ne peut être
            tenu responsable du contenu des conversations privées.
          </p>
          <p>
            Laboon ne garantit pas qu&apos;une mise en relation aboutira à une
            collaboration musicale effective.
          </p>
        </Section>
        <Section title="8. Signalement et modération">
          <p>
            Tout Utilisateur peut signaler un utilisateur, une annonce ou un message
            inapproprié via la fonction de signalement dans l&apos;application, et bloquer
            un autre Utilisateur : les annonces d&apos;un Utilisateur bloqué ne sont plus
            affichées, et il ne peut plus écrire à celui qui l&apos;a bloqué.
          </p>
          <p>
            Laboon peut refuser la publication d&apos;une annonce, ou la retirer, lorsque
            son contenu est contraire aux présentes CGU ou à la Charte de bonne conduite
            (contenu injurieux ou trompeur, démarchage commercial, demande d&apos;argent).
          </p>
          <p>
            Laboon s&apos;engage à examiner les signalements dans les meilleurs délais et
            à prendre les mesures appropriées (avertissement, suspension, suppression de
            compte). Les signalements sont conservés 12 mois au plus, sans nommer les
            personnes une fois leur compte supprimé (voir la politique de
            confidentialité).
          </p>
        </Section>
        <Section title="9. Disponibilité du service">
          <p>
            Laboon s&apos;efforce d&apos;assurer la disponibilité de l&apos;application
            24h/24 et 7j/7. Des interruptions peuvent survenir pour maintenance ou raisons
            techniques. Laboon ne saurait être tenu responsable de l&apos;indisponibilité
            temporaire des Services.
          </p>
        </Section>
        <Section title="10. Responsabilité">
          <p>
            Laboon agit en qualité d&apos;hébergeur des contenus publiés par les
            Utilisateurs, au sens de la LCEN. Sa responsabilité ne peut être engagée
            qu&apos;en cas de non-retrait d&apos;un contenu manifestement illicite dûment
            signalé.
          </p>
          <p>
            Laboon ne garantit pas la véracité des informations figurant sur les profils.
            Les collaborations organisées suite à des mises en relation via Laboon
            relèvent de la seule responsabilité des Utilisateurs concernés.
          </p>
        </Section>
        <Section title="11. Suspension et résiliation">
          <p>
            L&apos;Utilisateur peut supprimer son compte à tout moment depuis les
            paramètres de l&apos;application. Les données supprimées et celles qui sont
            conservées sont décrites dans la politique de confidentialité, section «
            Suppression du compte ».
          </p>
          <p>
            Laboon peut suspendre ou résilier un compte sans préavis en cas de violation
            des présentes CGU ou de comportement frauduleux.
          </p>
        </Section>
        <Section title="12. Modifications des CGU">
          <p>
            Laboon se réserve le droit de modifier les présentes CGU à tout moment. Les
            Utilisateurs seront informés de toute modification substantielle par
            notification dans l&apos;application ou par email.
          </p>
          <p>
            La poursuite de l&apos;utilisation de l&apos;application après notification
            vaut acceptation des nouvelles CGU.
          </p>
        </Section>
        <Section title="13. Droit applicable et juridiction">
          <p>Les présentes CGU sont régies par le droit français.</p>
          <p>
            En cas de litige, et à défaut de résolution amiable, les tribunaux compétents
            du ressort de Lyon seront saisis.
          </p>
        </Section>
        <Section title="14. Contact">
          <p>
            Pour toute question relative aux présentes CGU :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
