import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CHARTE_META = {
  title: "Charte de Bonne Conduite",
  version: "1",
  effectiveDate: "22/10/2026",
};
export default function Charte() {
  return (
    <article className="space-y-8">
      <DocHeader {...CHARTE_META} locale="fr" />
      <DocBody>
        <Section title="Notre vision">
          <p>
            Laboon est né d&apos;une conviction simple : trouver des musiciens avec qui
            jouer ne devrait pas être compliqué. Nous avons construit cette plateforme
            pour que les artistes puissent se rencontrer, collaborer et créer ensemble.
          </p>
          <p>
            Cette communauté n&apos;a de valeur que si chacun y contribue avec respect et
            bienveillance. La présente charte définit les règles de vie commune que tout
            membre de Laboon s&apos;engage à respecter.
          </p>
        </Section>
        <Section title="1. Respect et bienveillance">
          <p>
            La scène musicale est un espace de création et de partage. Sur Laboon, chaque
            musicien, quel que soit son niveau, son style ou son parcours, mérite
            d&apos;être traité avec respect.
          </p>
          <Subheading>Ce que nous attendons de toi :</Subheading>
          <List>
            <li>
              Communiquer de façon courtoise et constructive avec les autres membres
            </li>
            <li>
              Accueillir les musiciens de tous niveaux — débutant ou expérimenté, chacun a
              sa place
            </li>
            <li>
              Donner du feedback honnête mais bienveillant si un musicien te sollicite
            </li>
            <li>
              Respecter la diversité des styles, des genres et des cultures musicales
            </li>
          </List>
          <Subheading>Ce qui n&apos;est pas toléré :</Subheading>
          <List>
            <li>Les insultes, propos dégradants ou humiliants envers un autre membre</li>
            <li>
              Le harcèlement, l&apos;intimidation ou les menaces sous quelque forme que ce
              soit
            </li>
            <li>
              Les discriminations liées à l&apos;origine, au genre, à la religion, à
              l&apos;orientation sexuelle ou au handicap
            </li>
            <li>
              Les commentaires moqueurs sur le niveau musical ou les choix artistiques
              d&apos;un membre
            </li>
          </List>
        </Section>
        <Section title="2. Authenticité et honnêteté">
          <p>
            La confiance est la base de toute collaboration musicale. Un profil
            authentique, c&apos;est une mise en relation qui a des chances d&apos;aboutir.
          </p>
          <Subheading>Ce que nous attendons de toi :</Subheading>
          <List>
            <li>
              Renseigner un profil qui te représente fidèlement : instrument(s), niveau,
              style, disponibilité
            </li>
            <li>Partager des extraits audio/vidéo qui reflètent ton niveau réel</li>
            <li>
              Honorer tes engagements : si tu confirmes une répétition ou un projet,
              tiens-le
            </li>
            <li>Signaler rapidement si ta disponibilité ou ton projet change</li>
          </List>
          <Subheading>Ce qui n&apos;est pas toléré :</Subheading>
          <List>
            <li>
              Créer un faux profil ou usurper l&apos;identité d&apos;un autre artiste ou
              groupe
            </li>
            <li>Exagérer ou falsifier son niveau ou son expérience musicale</li>
            <li>
              Proposer une arnaque : faux cachet, fausse offre de recrutement, demande
              d&apos;argent ou de virement
            </li>
            <li>
              Publier du contenu audio/vidéo qui n&apos;est pas le tien sans le mentionner
              clairement
            </li>
          </List>
        </Section>
        <Section title="3. Utilisation de la messagerie">
          <p>
            La messagerie Laboon est un outil de mise en relation musicale — pas un canal
            publicitaire ou de démarchage.
          </p>
          <Subheading>Ce que nous attendons de toi :</Subheading>
          <List>
            <li>
              Envoyer des messages ciblés et personnalisés, en lien avec un projet musical
              concret
            </li>
            <li>
              Présenter ton projet clairement : style, objectif, fréquence de répétition
              attendue
            </li>
            <li>Respecter le silence ou le refus d&apos;un autre membre sans insister</li>
          </List>
          <Subheading>Ce qui n&apos;est pas toléré :</Subheading>
          <List>
            <li>Envoyer des messages en masse non sollicités (spam)</li>
            <li>
              Utiliser la messagerie à des fins commerciales, de démarchage ou de
              promotion non musicale
            </li>
            <li>
              Harceler un membre qui n&apos;a pas répondu ou qui a décliné un contact
            </li>
            <li>
              Partager les coordonnées personnelles d&apos;un membre sans son accord
              explicite
            </li>
          </List>
        </Section>
        <Section title="4. Contenus publiés">
          <p>
            Tout ce que tu publies sur Laboon — profil, photos, liens, messages — engage
            ta responsabilité.
          </p>
          <Subheading>Ce que nous attendons de toi :</Subheading>
          <List>
            <li>
              Publier uniquement des contenus dont tu détiens les droits ou pour lesquels
              tu as les autorisations nécessaires
            </li>
            <li>
              Choisir une photo de profil qui te représente toi (pas un logo de marque,
              pas une image de célébrité)
            </li>
            <li>
              Indiquer clairement la source si tu partages un contenu qui n&apos;est pas
              le tien
            </li>
          </List>
          <Subheading>Ce qui n&apos;est pas toléré :</Subheading>
          <List>
            <li>Publier des contenus à caractère sexuel, violent ou choquant</li>
            <li>
              Utiliser des images ou enregistrements d&apos;autrui sans autorisation
              (droits d&apos;auteur)
            </li>
            <li>
              Diffuser des informations fausses, trompeuses ou à caractère diffamatoire
            </li>
            <li>Faire la promotion de services, produits ou plateformes concurrentes</li>
          </List>
        </Section>
        <Section title="5. Vie privée et données personnelles">
          <p>
            Sur Laboon, tu partages des informations sur toi. Nous te demandons de faire
            de même avec les données des autres membres.
          </p>
          <Subheading>Ce que nous attendons de toi :</Subheading>
          <List>
            <li>
              Traiter les informations personnelles des autres membres avec discrétion
            </li>
            <li>
              Ne pas divulguer à des tiers les échanges privés que tu as sur la plateforme
            </li>
          </List>
          <Subheading>Ce qui n&apos;est pas toléré :</Subheading>
          <List>
            <li>
              Collecter, stocker ou redistribuer des données personnelles d&apos;autres
              membres sans leur consentement
            </li>
            <li>
              Photographier ou enregistrer un membre lors d&apos;une rencontre sans son
              accord
            </li>
            <li>
              Utiliser les informations de contact obtenues via Laboon à des fins autres
              que la collaboration musicale
            </li>
          </List>
        </Section>
        <Section title="6. Signalement et modération">
          <Subheading>Comment signaler ?</Subheading>
          <p>
            Si tu constates un comportement qui viole cette charte, utilise le bouton «
            Signaler » disponible sur chaque annonce, chaque profil et dans chaque
            conversation. Ton signalement est confidentiel.
          </p>
          <p>
            Tu peux aussi bloquer un membre : ses annonces ne s&apos;affichent plus et il
            ne peut plus t&apos;écrire.
          </p>
          <Subheading>Ce que Laboon s&apos;engage à faire :</Subheading>
          <List>
            <li>Examiner chaque signalement avec attention et impartialité</li>
            <li>
              Agir rapidement en cas de contenu ou comportement manifestement contraire à
              la charte
            </li>
            <li>
              Informer l&apos;auteur du signalement des suites données (dans la limite des
              règles de confidentialité)
            </li>
          </List>
          <Subheading>Les sanctions possibles :</Subheading>
          <List>
            <li>Avertissement écrit pour un premier manquement mineur</li>
            <li>Suspension temporaire du compte (de 7 à 30 jours selon la gravité)</li>
            <li>
              Suppression définitive du compte pour les violations graves ou répétées
            </li>
          </List>
          <p>
            Laboon se réserve le droit de signaler aux autorités compétentes tout contenu
            illicite (menaces, harcèlement caractérisé, contenus illégaux).
          </p>
        </Section>
        <Section title="7. Engagement de la communauté">
          <p>
            Cette charte n&apos;est pas qu&apos;un ensemble de règles — c&apos;est le
            reflet de la communauté que nous voulons construire ensemble.
          </p>
          <p>
            En utilisant Laboon, tu t&apos;engages à respecter cette charte et à
            contribuer à en faire une plateforme où chaque musicien se sent bienvenu,
            respecté et libre de créer.
          </p>
          <p>
            Des questions sur cette charte ? Contacte-nous à :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
