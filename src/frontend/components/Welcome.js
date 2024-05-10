import WelcomeData from './WelcomeData.js';
import Room1 from '../../assets/rooms1.jpg';
import Room2 from '../../assets/rooms2.jpg';

import './Welcome.css';
const Welcome = () => {
    return (
        <div className="welcome">
            <h1>Welcome to <span>Seazone</span> </h1>
            <p>"Where you meets world class luxury and hospitality"</p>

            <WelcomeData
                className="intro"
                heading="Our Introduction"
                text="Indulge in opulence by the sea at Seazone. Our hotel offers panoramic views, bespoke suites, and culinary excellence. Immerse yourself in tranquility at our spa and celebrate life's moments in exclusive event spaces. Seazone is more than a destination; it's a lifestyle. Your luxury escape begins here.
            Discover a world where every detail is crafted for an exceptional experience. At Seazone, personalized service ensures each moment is unforgettable. Whether a romantic retreat or family getaway, Seazone is a haven where indulgence meets genuine warmth. Welcome to your desires becoming reality."
                img1={Room1}
                img2={Room2}
            />

            <WelcomeData
                className="intro-reverse"
                heading="Amenities"
                text="Elevate your stay with unparalleled amenities at Seazone. Immerse yourself in the lap of luxury as our world-class facilities cater to your every need. From a rooftop infinity pool that offers breathtaking views of the sea to a fully equipped fitness center, our amenities redefine indulgence. Experience the epitome of comfort and convenience as you unwind in our exclusive lounges and embrace the serenity of our meticulously landscaped gardens."
                img1={Room2}
                img2={Room1}
            />

            <WelcomeData
                className="intro"
                heading="Spa & Wellness"
                text="Embark on a journey of rejuvenation at our state-of-the-art spa and wellness center. Seazone's spa is a sanctuary of serenity, where bespoke treatments and rituals are curated to restore balance to your mind, body, and soul. Indulge in the healing touch of our skilled therapists and surrender to the tranquility of our relaxation lounges. Whether it's a signature massage, a revitalizing facial, or a wellness retreat, our spa invites you to embrace holistic well-being in a setting of unparalleled luxury."
                img1={Room2}
                img2={Room1}
            />

            <WelcomeData
                className="intro-reverse"
                heading="Dining"
                text="At Seazone, culinary excellence is a journey of flavors that promises to tantalize your taste buds. Indulge in a symphony of gastronomic delights crafted by our renowned chefs. From intimate fine dining to casual al fresco experiences, each restaurant at Seazone is a culinary masterpiece. Savor the freshest local ingredients, paired with an extensive selection of fine wines and spirits. Our dining venues are not just places to eat; they are immersive experiences that celebrate the art of gastronomy."
                img1={Room2}
                img2={Room1}
            />

            <WelcomeData
                className="intro"
                heading="Events"
                text="At Seazone, we transform ordinary moments into extraordinary memories. Our exclusive event spaces set the stage for unparalleled celebrations, be it a romantic wedding, a corporate gathering, or a social soiree. Immerse yourself in the seamless blend of sophistication and personalized service as our dedicated team orchestrates every detail with precision. From breathtaking waterfront venues to versatile meeting spaces, Seazone offers the perfect backdrop for your special occasions. Let us turn your events into timeless experiences, where luxury meets celebration."
                img1={Room2}
                img2={Room1}
            />

        </div>
    )
}

export default Welcome
