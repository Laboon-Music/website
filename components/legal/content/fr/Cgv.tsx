import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CGV_META = {
  title: "Conditions Générales de Vente",
  version: "2",
  effectiveDate: "12/10/2026",
};
export default function Cgv() {
  return (
    <article className="space-y-8">
      <DocHeader {...CGV_META} locale="fr" />
      <p className="max-w-[62ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-muted">
        Offre d&apos;abonnement à destination des utilisateurs musiciens
      </p>
      <DocBody>
        <Section title="Préambule">
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations
            contractuelles entre Laboon, ci-après « le Prestataire », et tout utilisateur
            de l&apos;application Laboon, ci-après « l&apos;Utilisateur », souhaitant
            accéder aux fonctionnalités premium payantes de la plateforme.
          </p>
          <p>
            Laboon est une application mobile de mise en relation entre musiciens,
            proposant en complément de son offre gratuite des abonnements payants donnant
            accès à des fonctionnalités avancées.
          </p>
          <p>
            Toute souscription à un abonnement payant Laboon vaut acceptation sans réserve
            des présentes CGV ainsi que des Conditions Générales d&apos;Utilisation de la
            plateforme.
          </p>
        </Section>
        <Section title="1. Définitions">
          <List>
            <li>
              « Laboon » ou « le Prestataire » : Co-fondateurs de Laboon, exploitants de
              la plateforme.
            </li>
            <li>
              <strong>« Utilisateur »</strong> : toute personne physique majeure ayant
              créé un compte sur l&apos;application Laboon.
            </li>
            <li>
              <strong>« Abonnement »</strong> : la formule payante souscrite par
              l&apos;Utilisateur pour accéder aux fonctionnalités premium de Laboon.
            </li>
            <li>
              <strong>« Formule Sans Pub »</strong> : abonnement mensuel à 0,99 €/mois
              permettant la suppression des publicités dans l&apos;application.
            </li>
            <li>
              <strong>« Formule Premium »</strong> : abonnement mensuel à 4,99 €/mois
              donnant accès à l&apos;ensemble des fonctionnalités avancées de Laboon.
            </li>
            <li>
              <strong>« Services »</strong> : l&apos;ensemble des fonctionnalités
              accessibles à l&apos;utilisateur selon sa formule d&apos;abonnement.
            </li>
            <li>
              <strong>« Annonce »</strong> : offre publiée par l&apos;Utilisateur sur
              Laboon à destination d&apos;autres musiciens (recherche de partenaires,
              formation de groupe, projet musical, etc.).
            </li>
            <li>
              <strong>« Contenu boosté »</strong> : annonce mise en avant dans les
              résultats de recherche et le fil d&apos;actualité des autres utilisateurs.
            </li>
          </List>
        </Section>
        <Section title="2. Offres et tarifs">
          <p>
            Laboon propose les formules d&apos;abonnement suivantes à destination des
            musiciens inscrits sur la plateforme :
          </p>
          <Subheading>Formule Gratuite — 0 €/mois</Subheading>
          <List>
            <li>Accès à l&apos;application et à toutes les fonctionnalités de base</li>
            <li>Création et gestion d&apos;un profil musicien</li>
            <li>Recherche de musiciens et consultation des profils</li>
            <li>Messagerie interne</li>
            <li>
              Publication d&apos;annonces (nombre limité, expiration automatique au bout
              de 30 jours)
            </li>
            <li>Affichage de publicités dans l&apos;application</li>
          </List>
          <Subheading>Formule Sans Pub — 0,99 €/mois TTC</Subheading>
          <List>
            <li>Toutes les fonctionnalités de la formule Gratuite</li>
            <li>Suppression de toutes les publicités dans l&apos;application</li>
          </List>
          <Subheading>Formule Premium — 4,99 €/mois TTC</Subheading>
          <List>
            <li>Toutes les fonctionnalités de la formule Sans Pub</li>
            <li>
              Annonces illimitées — aucune restriction sur le nombre d&apos;annonces
              actives simultanément
            </li>
            <li>
              Pas d&apos;expiration automatique des annonces — vos annonces restent
              actives jusqu&apos;à ce que vous les supprimiez
            </li>
            <li>
              Annonces boostées — mise en avant prioritaire de vos annonces dans les
              résultats de recherche et le fil des musiciens
            </li>
            <li>
              Badge Premium — afficher sur votre profil, visible par tous les utilisateurs
              de la plateforme
            </li>
            <li>Zéro publicité dans l&apos;application</li>
          </List>
          <p>
            Les tarifs sont indiqués toutes taxes comprises (TTC). La TVA applicable est
            celle en vigueur en France au moment de la facturation.
          </p>
          <p>
            Laboon se réserve le droit de modifier ses tarifs avec un préavis d&apos;au
            moins 30 jours avant la date de renouvellement de l&apos;abonnement en cours.
          </p>
        </Section>
        <Section title="3. Souscription et durée">
          <Subheading>3.1 Souscription</Subheading>
          <p>
            La souscription à un abonnement payant s&apos;effectue directement depuis
            l&apos;application Laboon, via la section « Passer en Premium » accessible
            depuis le profil de l&apos;Utilisateur. Le paiement est géré via les systèmes
            de facturation intégrés à l&apos;App Store (Apple) ou au Google Play Store
            (Android), selon l&apos;appareil utilisé.
          </p>
          <p>L&apos;abonnement prend effet immédiatement après validation du paiement.</p>
          <Subheading>3.2 Durée et renouvellement</Subheading>
          <p>
            Les abonnements sont souscrits pour une durée d&apos;un (1) mois, renouvelés
            automatiquement par tacite reconduction à la date anniversaire, sauf
            résiliation par l&apos;Utilisateur dans les conditions prévues à
            l&apos;article 7.
          </p>
          <p>
            La gestion du renouvellement automatique s&apos;effectue directement depuis
            les paramètres de l&apos;App Store ou du Google Play Store selon la plateforme
            utilisée.
          </p>
          <Subheading>3.3 Changement de formule</Subheading>
          <p>
            L&apos;Utilisateur peut passer de la formule Sans Pub à la formule Premium
            (montée en gamme) ou inversement (rétrogradation) à tout moment depuis les
            paramètres de son abonnement. La modification prend effet à la prochaine date
            de renouvellement mensuel.
          </p>
        </Section>
        <Section title="4. Conditions de paiement">
          <Subheading>4.1 Modalités</Subheading>
          <p>
            Le règlement des abonnements s&apos;effectue via le système de paiement
            intégré à l&apos;App Store (Apple In-App Purchase) ou au Google Play Store
            (Google Play Billing), selon la plateforme de téléchargement de
            l&apos;application. Laboon n&apos;a pas accès direct aux données de paiement
            de l&apos;Utilisateur, celles-ci étant gérées exclusivement par Apple ou
            Google.
          </p>
          <p>
            La facturation intervient à la date de souscription, puis automatiquement à
            chaque renouvellement mensuel.
          </p>
          <Subheading>4.2 Justificatif de paiement</Subheading>
          <p>
            Les reçus de paiement sont émis directement par Apple ou Google et accessibles
            depuis l&apos;historique des achats de l&apos;App Store ou du Google Play
            Store. Laboon n&apos;émet pas de factures distinctes pour les abonnements
            souscrits via les stores.
          </p>
          <Subheading>4.3 Défaut de paiement</Subheading>
          <p>
            En cas d&apos;échec du prélèvement automatique (carte expirée, fonds
            insuffisants, etc.), Apple ou Google notifie l&apos;Utilisateur. En
            l&apos;absence de régularisation, l&apos;abonnement est automatiquement
            suspendu et l&apos;accès aux fonctionnalités premium est coupé jusqu&apos;à la
            mise à jour des informations de paiement.
          </p>
        </Section>
        <Section title="5. Description des services">
          <Subheading>5.1 Suppression des publicités</Subheading>
          <p>
            L&apos;abonnement Sans Pub et l&apos;abonnement Premium suppriment
            l&apos;intégralité des espaces publicitaires affichés dans l&apos;application
            Laboon. Cette suppression est active tant que l&apos;abonnement est en cours.
            En cas de résiliation, les publicités sont réaffichées dès la fin de la
            période d&apos;abonnement en cours.
          </p>
          <Subheading>5.2 Annonces illimitées (Premium)</Subheading>
          <p>
            La formule Premium permet à l&apos;Utilisateur de publier un nombre illimité
            d&apos;annonces simultanément, sans restriction de quota. Chaque annonce doit
            rester conforme aux Conditions Générales d&apos;Utilisation de Laboon et à la
            Charte de Bonne Conduite de la plateforme.
          </p>
          <Subheading>5.3 Pas d&apos;expiration automatique (Premium)</Subheading>
          <p>
            Les annonces publiées par un Utilisateur Premium restent actives sans limite
            de durée, jusqu&apos;à leur suppression manuelle par l&apos;Utilisateur ou en
            cas de violation des CGU. Les annonces publiées avant la souscription à la
            formule Premium et dont l&apos;expiration était déjà planifiée sont prolongées
            automatiquement dès l&apos;activation de l&apos;abonnement.
          </p>
          <Subheading>5.4 Annonces boostées (Premium)</Subheading>
          <p>
            La formule Premium inclut la mise en avant automatique et prioritaire des
            annonces de l&apos;Utilisateur dans les résultats de recherche et le fil
            d&apos;actualité des autres musiciens. Le boost est appliqué à toutes les
            annonces actives de l&apos;Utilisateur Premium. Laboon se réserve le droit de
            faire évoluer les modalités techniques du boost sans que cela constitue une
            modification substantielle du service.
          </p>
          <Subheading>5.5 Badge Premium (Premium)</Subheading>
          <p>
            Un badge visuel « Premium » est affiché sur le profil de l&apos;Utilisateur
            abonné à la formule Premium. Ce badge est visible par l&apos;ensemble des
            utilisateurs de la plateforme. Il disparaît automatiquement à la résiliation
            de l&apos;abonnement.
          </p>
          <Subheading>5.6 Disponibilité</Subheading>
          <p>
            Laboon s&apos;engage à maintenir la plateforme et les fonctionnalités premium
            accessibles 24h/24 et 7j/7, hors périodes de maintenance planifiées annoncées
            à l&apos;avance. En cas d&apos;interruption non planifiée des fonctionnalités
            premium dépassant 48 heures consécutives, l&apos;Utilisateur peut demander un
            avoir prorata temporis sur son abonnement en cours en contactant{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>.
          </p>
        </Section>
        <Section title="6. Droit de rétractation">
          <p>
            Conformément à l&apos;article L.221-18 du Code de la consommation,
            l&apos;Utilisateur particulier dispose d&apos;un délai de 14 jours à compter
            de la souscription pour exercer son droit de rétractation, sans avoir à
            justifier de motifs.
          </p>
          <p>
            Toutefois, conformément à l&apos;article L.221-28 du même code, le droit de
            rétractation ne peut pas être exercé pour les contenus numériques dont
            l&apos;exécution a commencé avec l&apos;accord exprès de l&apos;Utilisateur
            avant l&apos;expiration du délai de rétractation. En souscrivant un abonnement
            et en accédant immédiatement aux fonctionnalités premium, l&apos;Utilisateur
            reconnaît expressément renoncer à son droit de rétractation.
          </p>
          <p>
            Pour toute demande de rétractation dans le délai légal et avant tout accès aux
            fonctionnalités, l&apos;Utilisateur doit contacter Laboon à :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>.
          </p>
        </Section>
        <Section title="7. Résiliation">
          <Subheading>7.1 Résiliation par l&apos;Utilisateur</Subheading>
          <p>
            L&apos;Utilisateur peut résilier son abonnement à tout moment directement
            depuis les paramètres de l&apos;App Store (Apple) ou du Google Play Store
            (Android), selon la plateforme utilisée. La résiliation prend effet à la fin
            de la période mensuelle en cours. Aucun remboursement n&apos;est effectué pour
            la période déjà facturée.
          </p>
          <p>
            Après résiliation, l&apos;Utilisateur conserve l&apos;accès aux
            fonctionnalités premium jusqu&apos;à la fin de la période mensuelle payée,
            puis bascule automatiquement sur la formule Gratuite.
          </p>
          <Subheading>7.2 Résiliation par Laboon</Subheading>
          <p>
            Laboon peut résilier l&apos;abonnement d&apos;un Utilisateur sans préavis en
            cas de :
          </p>
          <List>
            <li>Violation grave ou répétée des CGU ou de la Charte de Bonne Conduite</li>
            <li>
              Utilisation frauduleuse de la plateforme ou des fonctionnalités premium
            </li>
            <li>Défaut de paiement non régularisé</li>
          </List>
          <p>
            En cas de résiliation par Laboon pour motif légitime, un remboursement prorata
            temporis de la période non consommée est effectué, sauf en cas de faute grave
            de l&apos;Utilisateur.
          </p>
          <Subheading>7.3 Suppression du compte</Subheading>
          <p>
            La suppression du compte par l&apos;Utilisateur entraîne automatiquement la
            résiliation de l&apos;abonnement. Aucun remboursement n&apos;est effectué pour
            la période en cours. La suppression du compte doit être effectuée au préalable
            depuis les paramètres de l&apos;App Store ou du Google Play Store afin
            d&apos;éviter tout renouvellement automatique.
          </p>
        </Section>
        <Section title="8. Responsabilité">
          <Subheading>8.1 Responsabilité de Laboon</Subheading>
          <p>
            Laboon est tenu à une obligation de moyens dans la fourniture des Services
            premium. Sa responsabilité ne peut être engagée en cas de :
          </p>
          <List>
            <li>
              Interruption de service due à un cas de force majeure ou à une défaillance
              technique de l&apos;hébergeur
            </li>
            <li>
              Indisponibilité temporaire des fonctionnalités premium due à une maintenance
            </li>
            <li>
              Perte de données résultant d&apos;une utilisation inappropriée de
              l&apos;application par l&apos;Utilisateur
            </li>
          </List>
          <p>
            En tout état de cause, la responsabilité de Laboon est limitée au montant des
            sommes effectivement versées par l&apos;Utilisateur au titre de son abonnement
            au cours des 3 derniers mois précédant le sinistre.
          </p>
          <Subheading>8.2 Responsabilité de l&apos;Utilisateur</Subheading>
          <p>
            L&apos;Utilisateur Premium est seul responsable du contenu de ses annonces et
            de l&apos;utilisation qu&apos;il fait des fonctionnalités avancées dans le
            respect des CGU et de la Charte de Bonne Conduite de la plateforme.
          </p>
        </Section>
        <Section title="9. Données personnelles">
          <p>
            Le traitement des données personnelles de l&apos;Utilisateur dans le cadre de
            la souscription à un abonnement est régi par la Politique de Confidentialité
            de Laboon, disponible dans l&apos;application et sur{" "}
            <TextLink href="https://laboon-app.com">laboon-app.com</TextLink>.
          </p>
          <p>
            Les données de paiement sont traitées exclusivement par Apple ou Google selon
            la plateforme utilisée. Laboon ne collecte ni ne stocke les données bancaires
            ou de carte de crédit de l&apos;Utilisateur.
          </p>
        </Section>
        <Section title="10. Modification des CGV">
          <p>
            Laboon se réserve le droit de modifier les présentes CGV à tout moment.
            L&apos;Utilisateur est informé de toute modification par notification dans
            l&apos;application ou par email au moins 30 jours avant l&apos;entrée en
            vigueur des nouvelles conditions.
          </p>
          <p>
            Si l&apos;Utilisateur n&apos;accepte pas les nouvelles conditions, il peut
            résilier son abonnement avant la date d&apos;entrée en vigueur sans pénalité.
            La poursuite de l&apos;utilisation des Services après cette date vaut
            acceptation des nouvelles CGV.
          </p>
        </Section>
        <Section title="11. Médiation et règlement des litiges">
          <p>
            En cas de litige relatif à un abonnement, l&apos;Utilisateur est invité à
            contacter en premier lieu le service client de Laboon à l&apos;adresse{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>. Laboon
            s&apos;engage à répondre dans un délai de 48 heures ouvrées.
          </p>
          <p>
            À défaut de résolution amiable, l&apos;Utilisateur peut recourir gratuitement
            à la médiation de la consommation auprès de :
          </p>
          <p>MED CONSO DEV (anciennement CNPM Médiation Consommation)</p>
          <p>
            Site : <TextLink href="https://medconsodev.eu">medconsodev.eu</TextLink>
          </p>
          <p>
            L&apos;Utilisateur peut également recourir à la plateforme européenne de
            règlement en ligne des litiges :{" "}
            <TextLink href="https://ec.europa.eu/consumers/odr">
              ec.europa.eu/consumers/odr
            </TextLink>
          </p>
        </Section>
        <Section title="12. Droit applicable et juridiction">
          <p>Les présentes CGV sont soumises au droit français.</p>
          <p>
            En cas de litige non résolu par médiation, les tribunaux compétents du ressort
            de Lyon seront saisis.
          </p>
        </Section>
        <Section title="13. Contact">
          <List>
            <li>
              <strong>Email</strong> :{" "}
              <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
            </li>
            <li>
              <strong>Délai de réponse</strong> : 48h ouvrées
            </li>
            <li>
              <strong>Site web</strong> :{" "}
              <TextLink href="https://laboon-app.com">laboon-app.com</TextLink>
            </li>
          </List>
        </Section>
      </DocBody>
    </article>
  );
}
