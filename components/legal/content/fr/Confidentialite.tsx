import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CONFIDENTIALITE_META = {
  title: "Politique de Confidentialité",
  version: "1",
  effectiveDate: "22/10/2026",
};
export default function Confidentialite() {
  return (
    <article className="space-y-8">
      <DocHeader {...CONFIDENTIALITE_META} locale="fr" />
      <p className="max-w-[62ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-muted">
        Conformément au Règlement (UE) 2016/679 du Parlement européen et du Conseil (RGPD)
        et à la loi Informatique et Libertés modifiée.
      </p>
      <DocBody>
        <Section title="1. Identité du responsable de traitement">
          <p>
            Laboon est édité à titre personnel par Mathieu Lopez (voir les mentions
            légales). Il est responsable du traitement des données personnelles collectées
            via l&apos;application.
          </p>
          <p>
            Contact :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
        <Section title="2. Données collectées">
          <Subheading>Votre compte :</Subheading>
          <List>
            <li>Prénom et nom, adresse e-mail</li>
            <li>Mot de passe (conservé sous forme chiffrée, jamais en clair)</li>
            <li>
              Si vous vous connectez avec Google ou Apple : l&apos;identifiant fourni par
              ce service, votre adresse e-mail (Apple peut la masquer), votre prénom et
              votre nom. La photo de votre compte Google n&apos;est pas importée.
            </li>
          </List>
          <Subheading>Votre profil (renseigné volontairement) :</Subheading>
          <List>
            <li>Instruments, niveau, styles, influences, disponibilités, biographie</li>
            <li>Photo de profil, visuels et pages de vos groupes</li>
            <li>
              Liens vers vos pages en ligne (Instagram, YouTube, SoundCloud, Spotify,
              etc.), affichés publiquement
            </li>
            <li>
              Une zone géographique de votre choix : le centre d&apos;une ville ou
              d&apos;un quartier et son rayon, jamais une adresse précise. Elle sert à
              trouver des musiciens et des annonces à proximité.
            </li>
          </List>
          <Subheading>Vos contenus et votre activité :</Subheading>
          <List>
            <li>Annonces, messages, favoris, recherches enregistrées</li>
            <li>Utilisateurs que vous bloquez, signalements que vous faites</li>
            <li>
              Votre dernière activité, selon vos réglages de confidentialité, et vos
              préférences de notification
            </li>
            <li>
              La version des documents légaux que vous avez acceptée, la date et la langue
            </li>
          </List>
          <Subheading>Données techniques :</Subheading>
          <List>
            <li>
              Jeton de notification de votre appareil, type d&apos;appareil et système,
              version de l&apos;application
            </li>
            <li>Adresse IP, dans les journaux des serveurs</li>
            <li>
              Avec votre consentement seulement : des statistiques d&apos;usage (écrans
              visités, fonctions utilisées) rattachées à un identifiant de votre compte,
              jamais à votre nom ni à votre e-mail, et des rapports de plantage
            </li>
          </List>
        </Section>
        <Section title="3. Finalités et bases légales du traitement">
          <List>
            <li>
              Créer et gérer votre compte, mettre les musiciens en relation, messagerie —
              Base légale : exécution du contrat
            </li>
            <li>
              Notifications de l&apos;application (messages, favoris, invitations) — Base
              légale : exécution du contrat, avec votre autorisation sur l&apos;appareil
            </li>
            <li>
              E-mails liés au service (mot de passe modifié, compte supprimé) — Base
              légale : exécution du contrat
            </li>
            <li>
              Modération et sécurité (signalements, blocages, prévention des abus) — Base
              légale : intérêt légitime
            </li>
            <li>
              Statistiques d&apos;usage et rapports de plantage — Base légale :
              consentement, que vous pouvez retirer à tout moment dans « Confidentialité
              et données »
            </li>
            <li>
              Lettre d&apos;information du site web (hors application) — Base légale :
              consentement
            </li>
          </List>
        </Section>
        <Section title="4. Durée de conservation">
          <List>
            <li>
              Données de compte : toute la durée d&apos;activité du compte, puis 3 ans
              après la dernière connexion, ou jusqu&apos;à la suppression du compte
            </li>
            <li>
              Signalements : 12 mois au plus après leur création, sans nommer les
              personnes une fois leur compte supprimé
            </li>
            <li>Journaux techniques : 12 mois</li>
            <li>
              Contacts de la liste d&apos;attente du site : jusqu&apos;au lancement de
              l&apos;application, puis 1 an
            </li>
            <li>
              Copies de sauvegarde : elles peuvent subsister temporairement après une
              suppression, jusqu&apos;à leur écrasement automatique
            </li>
          </List>
        </Section>
        <Section title="5. Destinataires des données">
          <p>
            Vos données personnelles ne sont pas vendues à des tiers. Laboon ne propose
            aucune publicité. Elles peuvent être traitées par nos prestataires, dans le
            cadre de contrats conformes au RGPD :
          </p>
          <List>
            <li>OVH : hébergement du serveur et de la base de données</li>
            <li>
              Cloudflare : protection et acheminement du trafic vers nos serveurs (votre
              adresse IP y transite)
            </li>
            <li>Vercel : hébergement du site web</li>
            <li>
              Apple et Google : connexion avec votre compte, notifications (APNs, FCM),
              et, avec votre consentement, statistiques d&apos;usage et rapports de
              plantage (Firebase)
            </li>
            <li>
              Un prestataire d&apos;envoi d&apos;e-mails, pour les e-mails liés au service
            </li>
          </List>
          <p>
            Les autorités compétentes peuvent aussi y avoir accès en cas d&apos;obligation
            légale. Tout transfert hors Union européenne fait l&apos;objet de garanties
            appropriées (clauses contractuelles types de la Commission européenne).
          </p>
        </Section>
        <Section title="6. Vos droits">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <List>
            <li>Droit d&apos;accès : obtenir une copie de vos données</li>
            <li>Droit de rectification : corriger des données inexactes</li>
            <li>
              Droit à l&apos;effacement (« droit à l&apos;oubli ») : voir la section «
              Suppression du compte »
            </li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit d&apos;opposition au traitement</li>
            <li>Droit de retirer votre consentement à tout moment</li>
          </List>
          <p>
            Vous pouvez corriger votre profil dans l&apos;application. L&apos;application
            ne propose pas encore d&apos;export automatique : pour obtenir une copie de
            vos données, écrivez-nous. Nous répondons dans un délai d&apos;un mois.
          </p>
          <p>
            Pour exercer ces droits :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la CNIL (
            <TextLink href="https://www.cnil.fr">www.cnil.fr</TextLink>).
          </p>
        </Section>
        <Section title="7. Suppression du compte" id="suppression-compte">
          <p>
            Vous pouvez demander la suppression de votre compte et des données associées à
            tout moment, de l&apos;une de ces deux façons.
          </p>
          <Subheading>Dans l&apos;application :</Subheading>
          <p>
            Profil, puis « Supprimer mon compte », puis confirmez. La suppression est
            immédiate et définitive. Pour un compte « Se connecter avec Apple », Apple
            vous demande aussi de confirmer, et l&apos;autorisation donnée à Laboon est
            révoquée.
          </p>
          <Subheading>Sans ouvrir l&apos;application :</Subheading>
          <p>
            Écrivez à{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink> depuis
            l&apos;adresse e-mail de votre compte, en indiquant « Suppression de compte
            Laboon ». Nous supprimons le compte dans un délai d&apos;un mois et vous
            confirmons par e-mail.
          </p>
          <Subheading>Ce qui est supprimé :</Subheading>
          <List>
            <li>
              Votre profil, vos liens, instruments, genres et influences, votre photo et
              les visuels des groupes dont vous étiez le seul membre
            </li>
            <li>
              Vos annonces, favoris, recherches enregistrées, blocages, notifications et
              jetons de notification, consentements et acceptations des documents légaux
            </li>
            <li>
              Les groupes dont vous étiez le seul membre. Si d&apos;autres membres
              restent, la propriété passe à un administrateur, sinon à un membre.
            </li>
          </List>
          <Subheading>Ce qui est conservé :</Subheading>
          <List>
            <li>
              Les messages que vous avez envoyés restent visibles de votre interlocuteur,
              sans votre nom (« Compte supprimé »). Une conversation sans participant est
              supprimée.
            </li>
            <li>
              Les signalements que vous avez faits ou reçus, sans vous nommer, 12 mois au
              plus, pour la modération.
            </li>
            <li>
              Des copies techniques de sauvegarde, temporairement, jusqu&apos;à leur
              écrasement automatique.
            </li>
          </List>
          <p>
            Laboon ne propose aucun abonnement payant : il n&apos;y en a donc aucun à
            résilier avant de supprimer le compte.
          </p>
        </Section>
        <Section title="8. Âge minimum">
          <p>
            Laboon est réservé aux personnes majeures (18 ans et plus). Nous ne collectons
            pas sciemment de données de personnes mineures. Si vous pensez qu&apos;un
            compte appartient à une personne mineure, écrivez-nous : nous le supprimerons.
          </p>
        </Section>
        <Section title="9. Cookies et traceurs">
          <p>
            L&apos;application mobile Laboon n&apos;utilise pas de cookies. Notre site web
            n&apos;utilise pas de cookies de suivi : il mesure son audience avec un outil
            qui n&apos;utilise ni cookie ni identifiant et ne permet pas de vous
            reconnaître d&apos;une visite à l&apos;autre. Aucun bandeau de consentement
            n&apos;est donc nécessaire.
          </p>
        </Section>
        <Section title="10. Sécurité">
          <p>
            Laboon met en œuvre des mesures techniques et organisationnelles appropriées
            pour protéger vos données : échanges chiffrés (HTTPS), mots de passe chiffrés,
            accès aux données restreint compte par compte.
          </p>
        </Section>
        <Section title="11. Modification de la politique">
          <p>
            Laboon se réserve le droit de modifier la présente politique à tout moment.
            Toute modification substantielle vous sera notifiée par e-mail ou via une
            notification dans l&apos;application.
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
