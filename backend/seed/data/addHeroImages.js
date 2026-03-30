require("dotenv").config();
const mongoose = require("mongoose");

// ── Replace with your actual MongoDB URI ──
const MONGO_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Error:", err));

// ── All hero images mapped by exact English name ──
const heroImages = {
  // ================================================================
  // BENGALURU
  // ================================================================
  "Lalbagh Botanical Garden":
    "https://www.theleela.com/prod/content/assets/aio-banner/dekstop/Lalbagh-Bangalore.jpg?VersionId=Wogc23RF149zdrz2c5B0tH5H9bsYSpJP",

  "Vidhana Soudha":
    "https://imgs.search.brave.com/kGsMqbp7s2x7ePAVBTSkocuCDTMDRIkmMCa6-6fzylE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90cmF2/ZWxzZXR1LmNvbS9h/cHBzL3VwbG9hZHMv/bmV3X2Rlc3RpbmF0/aW9uc19waG90b3Mv/ZGVzdGluYXRpb24v/MjAyMy8xMi8yMi9h/Y2I1YzM0MDdmNmIz/NjYwYzBiOTY4NDJi/OTViZDBiNF8xMDAw/eDEwMDAuanBn",

  "Someshwara Temple Halasuru":
    "https://www.rajasthanbhumitours.com/blog/wp-content/uploads/2024/11/Halasuru-Someshwara-Temple-A-Glimpse-into-Bangalores-Ancient-Heritage.webp",

  "SRI Balaji Printers Indiranagar":
    "https://images.jdmagicbox.com/v2/comp/bangalore/r3/080pxx80.xx80.110224161809.i4r3/catalogue/sri-balaji-printers-banashankari-2nd-stage-bangalore-printing-press-3yhaxaz.jpg",

  "Puttenahalli Lake":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoK2Ac5skFlsOAtZ4oHHJsAyBqqEQk9HFfBA&s",

  "Dodda Basavana Gudi (Bull Temple)":
    "https://media.gettyimages.com/id/899566254/photo/deity-sculptures-of-the-sri-big-bull-temple-in-dodda-ganeshana-gudi-complex-bangalore.jpg?s=1024x1024&w=gi&k=20&c=ENdur8hE5nHiXCZCb3MHodEEUXAA2Unr9We-YyGYU64=",

  "Commercial Street":
    "https://www.floortap.com/resources/wp-content/uploads/2024/09/commercial-street.jpg",

  "Russell Market Terrace":
    "https://i0.wp.com/thelocavore.in/wp-content/uploads/2023/05/DSC07557-1-scaled.jpg",

  "Gandhi Bazaar Metal Market":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyujMv4gnHX3iCR-B19HdYWaKMpRFvo-1-nQ&s",

  "Jayanagar Mango Tree Street":
    "https://www.thenatureofcities.com/TNOC/wp-content/uploads/2018/07/Feature-604x270.jpg",

  "Wipro Founder's House Garden":
    "https://i.ytimg.com/vi/l73m4Q8Pyz4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCFbrtJV0Bb7CTvFt5BLCZwW_x2OA",

  "Tipu Sultan's Summer Palace Summerhouse":
    "https://pohcdn.com/sites/default/files/styles/paragraph__hero_banner__hb_image__1880bp/public/hero_banner/Sultan_Tipu_Palace.jpg",

  "KR Market Flower Auction":
    "https://d34vm3j4h7f97z.cloudfront.net/original/4X/8/8/3/883afc93b628d5981004c0c1ad8b4e4dcca600d4.jpeg",

  "Baiyappanahalli Railway Graveyard":
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/ba/24/ea/forthill-graveyard.jpg?w=900&h=500&s=1",

  "Venkatappa Art Gallery Basement":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZTLLoIHf2Uoj-YOMg8fbAD8oPYTReTgrBiQ&s",

  "CTR - Central Tiffin Room":
    "https://content.jdmagicbox.com/v2/comp/bangalore/z9/080pxx80.xx80.250130192938.e1z9/catalogue/ctr-gangamuthanahalli-bangalore-restaurants-huyuh4ptsm.jpg",

  "Cubbon Park":
    "https://www.theleela.com/prod/content/assets/aio-banner/dekstop/Cubbon-Park.jpg?VersionId=F0U_LNka73Qf.h00S_TX_JI2Nqv9Ygrk",

  "Ulsoor Lake":
    "https://s7ap1.scene7.com/is/image/incredibleindia/ulsoor-lake-bangalore-karnataka-2-attr-hero?qlt=82&ts=1742198609552",

  "Nandi Hills": "https://holaciti.com/assets/place/1738428553_qVd3drIV3m.webp",

  // ================================================================
  // MYSURU
  // ================================================================
  "Mysore Palace":
    "https://www.mysoretourism.org.in/images/v2/places-to-visit/mysore-maharaja-palace-header-mysore-tourism.jpg",

  "Chamundeshwari Temple":
    "https://behindeverytemple.org/wp-content/uploads/2020/10/chamundeshwari-hero.jpg",

  "Mysore Zoo":
    "https://res.cloudinary.com/kmadmin/image/upload/v1722971163/kiomoi/1200px-Zoo_entrance_gate_%281%29_4591.webp",

  "Brindavan Gardens":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfXihPMgHVvL8LECIwoj25Yw1Hhcp2zMkyig&s",

  "Kabini River Lodge":
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/b2/2e/cf/jungle-lodges-kabini.jpg?w=900&h=500&s=1",

  // ================================================================
  // HAMPI
  // ================================================================
  "Virupaksha Temple":
    "https://d35xcwcl37xo08.cloudfront.net/current-affairs-wp-uploads/2025/04/virupaksha_temple.webp",

  "Vittala Temple Complex":
    "https://s7ap1.scene7.com/is/image/incredibleindia/vittala-temple-hampi-karnataka-1-attr-hero?qlt=82&ts=1726721522125",

  "Matanga Hill Sunrise":
    "https://kevinstandagephotography.wordpress.com/wp-content/uploads/2015/04/ksp_4178-2.jpg",

  "Hampi Bazaar & Stepped Tank":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSXVyo7ggDf4OkhtpbixVbrksiUnsbCTdjQw&s",

  "Tungabhadra Coracle Ride":
    "https://www.shadowsgalore.com/wp-content/uploads/2013/01/Hampi_Coracle_mini.jpg",

  // ================================================================
  // COORG
  // ================================================================
  "Abbey Falls":
    "https://www.sterlingholidays.com/activities/brookstone-coorg/abbey-falls.jpg.imgw.1280.1280.jpeg",

  Talacauvery:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrQANhZifSo8y2oMpUx1qzCLJ-TjbhS4RaQg&s",

  "Honey Valley Homestay":
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/6f/95/69/tranquil.jpg?w=700&h=400&s=1",

  "Madikeri Fort":
    "https://coorgtourism.co.in/images/places-to-visit/headers/madikeri-fort-coorg-entry-fee-timings-holidays-reviews-header.jpg",

  "Haremalge 7-Step Falls":
    "https://captureatrip-cms-storage.s3.ap-south-1.amazonaws.com/Best_Time_to_Visit_the_Seven_Sisters_Falls_in_Meghalaya_75c27fb32a.webp",

  // ================================================================
  // CHIKMAGALUR
  // ================================================================
  "Mullayanagiri Peak":
    "https://ik.imagekit.io/xoxqszf3k/wp-content/uploads/2015/08/Mullayanagiri-4.jpg",

  "Baba Budangiri":
    "https://ik.imagekit.io/xoxqszf3k/wp-content/uploads/2015/08/Baba-Budangiri-Hills-2.jpg",

  "Coffee Trail — Seetharaman Estate":
    "https://th.bing.com/th/id/OIP.fMUtpJcnHNA0_mDCYPnR5QHaEK?w=321&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

  "Thippanahalli Estate Ghost Bungalow":
    "https://media3.thrillophilia.com/filestore/qw5xeq2fdr33q5xs70m1geq8spir_01.PNG?w=576&h=650",

  "Kemmangundi Hanging Valley":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs49rXFPVNvySefyAQrnVGB1pxicvwGjurPA&s",

  "Shettihalli Submerged":
    "https://curlytales.com/wp-content/uploads/2020/08/church-art-railyatri.jpg",

  // ================================================================
  // UDUPI
  // ================================================================
  "Udupi Sri Krishna Temple":
    "https://richedwardsimagery.wordpress.com/wp-content/uploads/2023/01/an-elevated-view-of-the-lighted-green-pond-the-temple-complex-and-the-chariots-at-the-start-of-the-lake-festival-udupi-sri-krishna-temple-udupi-india-unfortunately-there-is-no-soundtrack.jpg",

  "St. Mary's Island":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCN_q8JshYhKfZAgjaI2oZpc0Rzy-A5XZ3Iw&s",

  "Mattu Beach Crab Festival":
    "https://english.varthabharati.in/storage/uploads/karavali/BeachRep_vb_28.jpeg",

  "Anegudde Hidden Vinayaka Cave":
    "https://i0.wp.com/travelwithkamath.com/wp-content/uploads/2024/10/Entrance.jpg?resize=1024%2C538&ssl=1",

  "Kodachadri Peak Dawn Camp":
    "https://res.cloudinary.com/dyiffrkzh/image/upload/c_fill,f_auto,fl_progressive.strip_profile,g_center,h_640,q_auto,w_1110/v1708431023/banbanjara/nlinsfv2lk0kzc6f153y.jpg",

  // ================================================================
  // GOKARNA
  // ================================================================
  "Om Beach":
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/53/5e/7f/om-beach.jpg?w=1200&h=-1&s=1",

  "Mahabaleshwara Temple Gokarna":
    "https://templeinkarnataka.com/wp-content/uploads/2024/08/Mahabaleshwara-Temple1.png",

  "Half Moon Beach Cliff Jump":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyVc1ymrzPNuzA0il_pGdBcAYdLYeP2jHdfA&s",

  // ================================================================
  // MANGALORE
  // ================================================================
  "Panambur Beach":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReuS611oJCFwo4bJ7fzu-vTFJTJJXKKaI0vg&s",

  "Kadri Manjunath Temple":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRm0btEhFXOhJSCTi518A0D3-DDLrp5JkU6w&s",

  "Mahalasa Fish Market & Tasting":
    "https://images.livemint.com/img/2023/06/29/original/old_Mangalore_fishing_port_1688021199391.jpg",

  "Bolar Fish Traps Dawn Patrol":
    "https://media.istockphoto.com/id/858655320/photo/the-pangalanes-canal.jpg?s=612x612&w=0&k=20&c=X-30Tyn8zD2NvbUFRZFbdM-ZXzQoc3eqTmJFJ7aZrUc=",

  // ================================================================
  // BANDIPUR / KABINI / SHIVAMOGGA
  // ================================================================
  "Gopalswamy Hill Salt Lick":
    "https://myholidayhappiness.com/uploads/himavad-gopalaswamy-betta-6473.jpg",

  "Kabini Jenu Kuruba Honey Hunt":
    "https://assets.simplotel.com/simplotel/image/upload/x_55,y_0,w_1810,h_1358,r_0,c_crop,q_90,fl_progressive/w_500,f_auto,c_fit/the-serai-kabini/honeybees-4013742_1920_jsh172",

  "Sakrebailu Elephant Camp Night Feeding":
    "https://cdn.junglelodges.com/uploads/2025/08/WhatsApp-Image-2025-08-21-at-3.48.51-PM-scaled_935x518_acf_cropped.jpeg",

  // ================================================================
  // BADAMI / BIJAPUR / PATTADAKAL
  // ================================================================
  "Badami Gujjari Lake Ghost Village":
    "https://s7ap1.scene7.com/is/image/incredibleindia/bhutanatha-temple-badami-karnataka-1-attr-hero?qlt=82&ts=1726717455559",

  "Gol Gumbaz Bijapur":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR85IIQlINNXLlYGvV1v5OnTcoSFyksYQ9FeA&s",

  "Pattadakal Temple Complex":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrrPjXv5RFMPqtsURrmQGr3RapkuAlNykidQ&s",

  // ================================================================
  // GERUSOPPA / DANDELI / JOG / KUNDAPUR
  // ================================================================
  "Gerusoppa Tengu Falls Backwaters":
    "https://karnatakatourismhotels.com/wp-content/uploads/2025/08/Mayura-Gerusoppa-Jogfalls-view_10_11zon.jpg",

  "Dandeli Whitewater Rafting":
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/26/c8/68/river-rafting-in-dandeli.jpg?w=1100&h=1100&s=1",

  "Jog Falls":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH6_zEG6f75O-sEGYDcUTS9C0RwNsN06_CSQ&s",

  // Add these 8 entries to the heroImages object in your addHeroImages.js script

  // ================================================================
  // BENGALURU — SECRET CAFES, STREET FOOD, GAMING, BOOKSTORES
  // ================================================================
  "Matteo Coffea":
    "https://b.zmtcdn.com/data/pictures/chains/1/50661/87abb0674aa11a758be284168327cd05_featured_v2.jpg?fit=around|960:500&crop=960:500;*,*",

  "Hole in the Wall Café":
    "https://b.zmtcdn.com/data/pictures/4/54044/51a5f23a0e9339034db72b9d0ee2bfea.jpg?fit=around|960:500&crop=960:500;*,*",

  "VV Puram Thindi Beedi":
    "https://media.assettype.com/deccanherald%2Fimport%2Fsites%2Fdh%2Ffiles%2Farticleimages%2F2022%2F12%2F23%2Ffile7o24t9c4hdvvls01gri-1174266-1671748031.jpg?w=undefined&auto=format%2Ccompress&fit=max",

  "Gamer's Den, Indiranagar":
    "https://media.insider.in/image/upload/w_800/v1768981093/bxazq15vyhzqsj8yy3zd.png",

  "Infinitum Board Game Lounge":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkjZFvGwa3YCQx4U3B8bOmNAY-0QDIQZJdeA&s",

  "Blossom Book House":
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/24/34/7d/blossom.jpg?w=600&h=600&s=1",

  "Champaca Books & Café":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRobMPRjJs42joAhBFunj6vA_1D5C8q15F1VA&s",
};

// ── Schema: open schema so we don't need to import your full model ──
const LocationSchema = new mongoose.Schema(
  {},
  { strict: false, collection: "locations" }
);
const Location = mongoose.model("Location", LocationSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    let updated = 0;
    let notFound = 0;

    for (const [name, url] of Object.entries(heroImages)) {
      const result = await Location.updateOne(
        { "name.en": name },
        { $set: { heroImage: url } }
      );

      if (result.matchedCount === 0) {
        console.log(`⚠️  NOT FOUND: "${name}"`);
        notFound++;
      } else {
        console.log(`✅  Updated:   "${name}"`);
        updated++;
      }
    }

    console.log("\n─────────────────────────────────");
    console.log(`✅  Updated : ${updated} locations`);
    if (notFound > 0) {
      console.log(
        `⚠️   Missing : ${notFound} (check exact name spelling above)`
      );
    }
    console.log("─────────────────────────────────\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected. Done.");
  }
}

run();