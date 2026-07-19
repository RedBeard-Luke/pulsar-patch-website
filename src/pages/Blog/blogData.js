/* ── Blog images ── */
import imgMargarita from '../../assets/blog/margarita.jpg'
import imgOldFashioned from '../../assets/blog/old-fashioned.jpg'
import imgWineDinner from '../../assets/blog/wine-dinner.jpg'
import imgScienceLab from '../../assets/blog/science-lab.jpg'
import imgFriendsBar from '../../assets/blog/friends-bar.jpg'
import imgCocktailsBar from '../../assets/blog/cocktails-bar.jpg'
import imgMorningBed from '../../assets/blog/morning-bed.jpg'
import imgPatchArm from '../../assets/blog/patch-arm.jpg'
import imgMondayCoffee from '../../assets/blog/monday-coffee.jpg'
import imgScienceBehindPulsarGinger from '../../assets/blog/science-behind-pulsar-ginger.jpg'
import imgLowCalorieMargarita from '../../assets/blog/low-calorie-margarita.jpg'
import imgHangoversArentInevitable from '../../assets/blog/hangovers-arent-inevitable.jpg'
import imgFastedOldFashion from '../../assets/blog/fasted-old-fashion.jpg'
import imgFastedOldFashionWhiskey from '../../assets/blog/fasted-old-fashion-whiskey.jpg'
import imgScienceBehindPulsar from '../../assets/blog/science-behind-pulsar.jpg'

/* ── Blog post content with sources ── */

export const blogPosts = {
  // ── STAGED DRAFT: winning post from the self-improving generator (not published until deployed). ──
  'zero-proof-spritz': {
    title: 'THE ZERO-PROOF SPRITZ FOR YOUR NIGHT OFF',
    category: 'RECIPES',
    tagColor: 'bg-[#FFA700]',
    date: 'DRAFT',
    heroImg: imgCocktailsBar,
    heroDescription: "I go through phases where I just don't want a drink in my hand, and I still want something in a nice glass that feels like an occasion. That's how this spritz happened. It's bright, a little bitter, a little fizzy, and it gives you all the ritual of happy hour without any of the morning-after math.",
    content: [
      {
        type: 'heading',
        body: "WHY I BUILT A SPRITZ INSTEAD OF SKIPPING THE GLASS"
      },
      {
        type: 'text',
        body: "Honestly, half of drinking culture is the glassware and the ritual, not the alcohol itself. I wanted something I could hand a friend at a backyard hangout that looked like a proper cocktail, not an afterthought soda. A spritz is perfect for that because the format is already built around bubbles, citrus, and a bitter edge, none of which require alcohol to work. I also like that a zero-proof night means I'm not undoing whatever my body was trying to recover from the last time I did drink. Alcohol hangovers are now understood to come from a mix of things happening at once in your body, not one tidy cause, which is part of why the morning after can hit differently depending on the night, as research collected in the National Library of Medicine lays out. Skipping the glass for a night is an easy way to give all of that a break."
      },
      {
        type: 'heading',
        body: "THE RECIPE"
      },
      {
        type: 'text',
        body: "Here's what I use, scaled for one tall glass:\n\n• 3 oz non-alcoholic bittersweet aperitif (I like the ones that lean orange-peel and rhubarb)\n• 2 oz sparkling water or soda water\n• 1 oz fresh grapefruit juice\n• A splash of tonic if you want more bitterness\n• Ice, a lot of it\n• Orange wheel and a rosemary sprig for garnish"
      },
      {
        type: 'text',
        body: "Fill a wine glass most of the way with ice, pour the aperitif and grapefruit juice over it, then top slowly with the sparkling water so it doesn't foam over. Give it one gentle stir, never a hard shake, so you don't kill the bubbles. Garnish with the orange wheel and tuck the rosemary sprig in so it brushes your nose when you drink. That little aromatic hit does a lot of the work that alcohol's warmth usually does in a real spritz."
      },
      {
        type: 'heading',
        body: "MAKING IT A WHOLE NIGHT, NOT JUST A DRINK"
      },
      {
        type: 'text',
        body: "If I'm hosting, I'll set up a small station with two or three bittersweet aperitifs, a bowl of citrus, and a few bitters so people can build their own. It turns the zero-proof spritz into a conversation instead of a consolation prize. I usually put out sparkling water in bottles instead of a soda gun, because it stays fizzier longer and looks better on the table."
      },
      {
        type: 'text',
        body: "One thing I've noticed on the nights I actually do drink is that it can get in the way of my body absorbing vitamins the way it should, since heavy drinking is linked to problems with thiamine (vitamin B1) absorption, according to the Alcohol and Drug Foundation. It's part of why I like having a genuinely alcohol-free option in rotation instead of always defaulting to 'just one.' And on the mornings after nights when I do have a few, hangover symptoms seem to be more about your body's inflammatory response kicking in than about dehydration alone, as Cedars-Sinai explains. That's a big part of why I keep a Pulsar patch on hand for the nights I do choose to drink, since it's designed to work through the skin instead of your gut, which can help more of what's in it actually reach your system compared to swallowing a pill and running it through first-pass metabolism, as Pharmacy Times describes. Researchers have also been looking at whether glutathione, an antioxidant your body makes naturally, plays a role in how people feel after drinking, and it's been tested in at least one randomized, placebo-controlled trial published in the journal Nutrients."
      },
      {
        type: 'heading',
        body: "A GLASS WORTH REPEATING"
      },
      {
        type: 'text',
        body: "What I like most about this spritz is that it doesn't feel like a substitute, it feels like its own thing. I'll reach for it on plenty of nights that have nothing to do with cutting back, just because it's genuinely good. Keep the ratios loose, taste as you go, and don't be afraid to let the bitter aperitif lead. The goal isn't to replace what a cocktail does, it's to build a glass that stands on its own."
      }
    ],
    sources: [
      { name: 'National Library of Medicine', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6761819/' },
      { name: 'Alcohol and Drug Foundation', url: 'https://adf.org.au/insights/alcohol-related-thiamine-deficiency/' },
      { name: 'Cedars-Sinai', url: 'https://www.cedars-sinai.org/stories-and-insights/healthy-living/science-of-hangovers' },
      { name: 'Pharmacy Times', url: 'https://www.pharmacytimes.com/view/delivery-methods-the-patch-versus-the-oral-route' },
      { name: 'Nutrients', url: 'https://www.mdpi.com/2072-6643/16/19/3262' },
    ],
  },

  'what-is-pulsar-patch': {
    title: 'WHAT IS PULSAR PATCH',
    category: 'SCIENCE',
    tagColor: 'bg-pulsar-pink',
    date: 'MAY 8',
    heroImg: imgPatchArm,
    heroDescription: "If you've ever woken up thinking, \"I probably could've planned that better,\" you're not alone. Pulsar Patch exists for exactly that moment. It's a simple, thoughtfully designed patch made for routines that don't always behave.",
    content: [
      {
        type: 'text',
        body: "Pulsar Patch is a transdermal hangover defense patch that delivers six active ingredients directly through your skin while you sleep. No pills to remember, no powders to mix, no chalky drinks before bed. You peel it, stick it on, and go about your night."
      },
      {
        type: 'heading',
        body: "HOW DOES A HANGOVER PATCH WORK?"
      },
      {
        type: 'text',
        body: "The patch uses transdermal delivery, the same technology behind nicotine patches and pain relief patches. According to research published by the National Institutes of Health, transdermal drug delivery bypasses first-pass GI and hepatic metabolism, meaning bioavailability is increased and less of the active ingredient is lost compared to oral supplements. When applied to clean skin, the ingredients absorb steadily over 8 to 12 hours. Your body gets a consistent supply of support while you sleep, instead of a single spike from a pill that your stomach may not even fully absorb."
      },
      {
        type: 'text',
        body: "Inside each patch you'll find Vitamin B, Vitamin B3, Vitamin B9, Glutathione, NAC (N-Acetylcysteine), and Ginger Extract. These six ingredients were chosen because they support the natural processes your body uses to recover after drinking. Nothing experimental, nothing unnecessary."
      },
      {
        type: 'image',
        img: imgScienceLab,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "WHO IS PULSAR PATCH FOR?"
      },
      {
        type: 'text',
        body: "If you enjoy going out but hate the way the next morning feels, Pulsar was designed with you in mind. It's for the person who has brunch plans the day after a night out. The one who has a workout they don't want to skip. The friend who always says \"I'm never drinking again\" and then does."
      },
      {
        type: 'text',
        body: "Pulsar isn't about drinking more or being reckless. It's about being prepared. One patch, applied before your first drink, and you've done your part. The rest is between you and your alarm clock."
      },
      {
        type: 'heading',
        body: "WHY CHOOSE A PATCH OVER PILLS OR DRINKS?"
      },
      {
        type: 'text',
        body: "Most hangover supplements come in pill or powder form. The problem is your stomach is already working overtime when you're drinking. Adding more to the mix can reduce absorption and cause nausea. As noted by Pharmacy Times, transdermal administration allows prolonged release of medications while minimizing adverse effects due to lower drug peak concentrations. A patch bypasses the digestive system entirely, delivering ingredients at a steady rate directly into your bloodstream."
      },
      {
        type: 'text',
        body: "Plus, there's the convenience factor. You apply it once and forget about it. No carrying bottles around, no timing doses throughout the night, no nasty taste."
      },
    ],
    sources: [
      { name: 'NIH: Transdermal Drug Delivery', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2700785/' },
      { name: 'Pharmacy Times: The Patch vs Oral Route', url: 'https://www.pharmacytimes.com/view/delivery-methods-the-patch-versus-the-oral-route' },
    ]
  },

  'how-often-use-pulsar': {
    title: 'HOW OFTEN CAN I USE A PULSAR PATCH?',
    category: 'LIFESTYLE',
    tagColor: 'bg-pulsar-blue',
    date: 'MAY 8',
    heroImg: imgFriendsBar,
    heroDescription: "One of the most common questions we get is about frequency. Can you wear a Pulsar Patch every weekend? What about back-to-back nights? Here's what you need to know.",
    content: [
      {
        type: 'text',
        body: "Pulsar Patch is designed for occasional use whenever you plan on drinking. Most of our customers use one patch per night out, typically one to three times per week. Each patch is meant for a single use, applied about 30 minutes before your first drink and worn for 8 to 12 hours."
      },
      {
        type: 'heading',
        body: "CAN YOU WEAR A PATCH EVERY DAY?"
      },
      {
        type: 'text',
        body: "While the ingredients in Pulsar Patch are safe and well-tolerated, the patch is intended for use on nights when you're drinking. There's no benefit to wearing one on a night you're staying in. The ingredients are specifically chosen to support your body's recovery process after alcohol consumption."
      },
      {
        type: 'image',
        img: imgPatchArm,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "BACK-TO-BACK NIGHTS: WHAT TO KNOW"
      },
      {
        type: 'text',
        body: "Going out Friday and Saturday? Use a fresh patch each night. Apply it to a different area of skin to avoid irritation, and make sure to remove the first patch before applying the second. Your inner arm, upper arm, and shoulder are all great spots."
      },
      {
        type: 'text',
        body: "The key is giving your skin a break between applications. Rotating the placement keeps things comfortable and ensures proper absorption each time."
      },
      {
        type: 'heading',
        body: "TIPS FOR GETTING THE BEST RESULTS"
      },
      {
        type: 'text',
        body: "Apply to clean, dry, hairless skin. Avoid areas with lotion or sunscreen. Press firmly for 10 seconds after application. Stay hydrated throughout the night. These simple steps make a real difference in how you feel the next morning."
      },
    ],
    sources: []
  },

  'weekend-plans-monday-energy': {
    title: 'WEEKEND PLANS, MONDAY ENERGY',
    category: 'LIFESTYLE',
    tagColor: 'bg-pulsar-blue',
    date: 'MAY 8',
    heroImg: imgMondayCoffee,
    heroDescription: "Your weekend shouldn't cost you your Monday. Here's how to keep the fun without losing your edge when the week starts back up.",
    content: [
      {
        type: 'text',
        body: "We've all been there. Friday night was incredible, Saturday was even better, and by Sunday you're running on fumes. Monday hits and you're two coffees deep before 9am, wondering why you agreed to that third round."
      },
      {
        type: 'heading',
        body: "THE REAL COST OF A ROUGH WEEKEND"
      },
      {
        type: 'text',
        body: "Hangovers don't just ruin your morning. They can throw off your entire week. Research from Wiley's Alcohol, Clinical and Experimental Research journal shows that inflammation and oxidative stress are the main drivers of hangover symptoms. Poor sleep quality after drinking leads to brain fog, reduced focus, and lower energy levels that can linger for days. A single rough Sunday can snowball into a sluggish Monday, a distracted Tuesday, and before you know it, half your week feels off."
      },
      {
        type: 'image',
        img: imgMorningBed,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "HOW TO PROTECT YOUR WEEKDAY PRODUCTIVITY"
      },
      {
        type: 'text',
        body: "The move isn't to stop going out. It's to go out smarter. Hydrate between drinks. Eat before you head out. And give your body the support it needs to bounce back with a Pulsar Patch. Applied before your first drink, it works quietly through the night so your Sunday morning doesn't become a recovery mission."
      },
      {
        type: 'text',
        body: "Think of it as planning ahead for the version of you that has things to do tomorrow. Because the best weekends are the ones where Monday still feels manageable."
      },
    ],
    sources: [
      { name: 'Wiley: Inflammation, Oxidative Stress and Hangover', url: 'https://onlinelibrary.wiley.com/doi/10.1111/acer.15396' },
    ]
  },

  '1-bottle-wine-vs-pulsar': {
    title: '1 BOTTLE OF WINE VS 1 PULSAR PATCH',
    category: 'LIFESTYLE',
    tagColor: 'bg-pulsar-blue',
    date: 'MAY 8',
    heroImg: imgWineDinner,
    heroDescription: "A bottle of wine with dinner is one of life's simple pleasures. But the next morning? Not always so pleasant. Let's break down what actually happens and how one patch changes the equation.",
    content: [
      {
        type: 'text',
        body: "A standard bottle of wine contains about five glasses. For most people, that's enough to have a great evening and a not-so-great morning. Your body processes alcohol at roughly one standard drink per hour, which means a full bottle puts your liver on overtime well into the early hours."
      },
      {
        type: 'heading',
        body: "WHAT HAPPENS INSIDE YOUR BODY"
      },
      {
        type: 'text',
        body: "When you drink wine, your liver converts alcohol into acetaldehyde, a toxic compound that causes many of the symptoms we associate with hangovers: headaches, nausea, and fatigue. According to a 2024 study published in Nutrients, glutathione plays a critical role in neutralizing acetaldehyde. The study found that GSH supplementation significantly decreased acetaldehyde concentration in serum compared to placebo groups. But here's the catch: alcohol actually depletes your glutathione levels right when you need them most."
      },
      {
        type: 'image',
        img: imgWineDinner,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "WHERE PULSAR PATCH COMES IN"
      },
      {
        type: 'text',
        body: "Pulsar delivers Glutathione and NAC (which helps your body produce more Glutathione) transdermally while you sleep. A randomized trial published in Scientific Reports found that NAC, as a glutathione precursor, has the potential to decrease oxidative stress on the liver during ethanol degradation. Pulsar also replenishes B Vitamins that alcohol strips from your system and includes Ginger Extract to ease your stomach."
      },
      {
        type: 'text',
        body: "One patch, applied before that first pour, supports your body through what the wine puts it through. The cost comparison is worth noting too. A decent bottle of wine runs $15 to $30. A single Pulsar Patch costs $6. That's a small price for waking up feeling like you skipped the bottle entirely."
      },
    ],
    sources: [
      { name: 'Nutrients: GSH and Alcohol Metabolism Clinical Trial', url: 'https://www.mdpi.com/2072-6643/16/19/3262' },
      { name: 'Scientific Reports: NAC in Prevention of Hangover', url: 'https://www.nature.com/articles/s41598-021-92676-0' },
    ]
  },

  'why-do-hangovers-happen': {
    title: 'WHY DO HANGOVERS EVEN HAPPEN',
    category: 'SCIENCE',
    tagColor: 'bg-pulsar-pink',
    date: 'MAY 8',
    heroImg: imgMorningBed,
    heroDescription: "Everyone knows what a hangover feels like. But surprisingly few people understand why it happens. Spoiler: it's not just dehydration.",
    content: [
      {
        type: 'text',
        body: "The morning after a night of drinking can feel like your body is staging a protest. Pounding headache, dry mouth, nausea, fatigue, sensitivity to light. But what's actually going on inside you? The answer is more complex than \"you just need to drink more water.\""
      },
      {
        type: 'heading',
        body: "ACETALDEHYDE: THE REAL VILLAIN"
      },
      {
        type: 'text',
        body: "When your liver processes alcohol, it first converts it into a compound called acetaldehyde. This substance is significantly more toxic than alcohol itself. Normally, your body breaks it down quickly using an enzyme called aldehyde dehydrogenase and an antioxidant called Glutathione. But when you drink heavily, your body can't keep up."
      },
      {
        type: 'text',
        body: "According to a comprehensive review published in the Journal of Clinical Medicine, acetaldehyde is a commonly cited factor suggested to manifest sickness behavior in hangovers. The same review found that byproducts of alcohol metabolism, sleep deprivation, and the activation of CYP2E1 in alcohol-exposed tissues all exacerbate free radical generation, compounding the damage."
      },
      {
        type: 'heading',
        body: "INFLAMMATION AND YOUR IMMUNE SYSTEM"
      },
      {
        type: 'text',
        body: "Alcohol triggers an inflammatory response throughout your body. Research published in the Journal of Clinical Medicine found that hangover severity was significantly and positively correlated with blood concentrations of inflammatory biomarkers, particularly Interleukin-6 (IL-6), tumor necrosis factor-alpha (TNF-\u03b1), and C-reactive protein (CRP). These are the same immune system molecules that make you feel terrible when you have the flu."
      },
      {
        type: 'text',
        body: "According to Cedars-Sinai, when cytokines get active, the immune system begins firing, and that can cause inflammation, which triggers a host of hangover symptoms including headaches, chills, fatigue, nausea, and stomach upset. This inflammatory cascade is why hangovers feel so much like being sick."
      },
      {
        type: 'image',
        img: imgScienceLab,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "DEHYDRATION IS ONLY PART OF THE PICTURE"
      },
      {
        type: 'text',
        body: "Yes, alcohol is a diuretic and dehydration plays a role. But research shows that hangovers occur even when people rehydrate during and after drinking. A 2024 narrative review in Alcohol, Clinical and Experimental Research concluded that inflammation and associated oxidative stress together represent the main causes of the alcohol hangover, not dehydration alone."
      },
      {
        type: 'heading',
        body: "B VITAMIN DEPLETION: THE HIDDEN FACTOR"
      },
      {
        type: 'text',
        body: "Alcohol interferes with nutrient absorption in a significant way. According to the Alcohol and Drug Foundation, up to 80% of people with chronic heavy alcohol use develop thiamine (Vitamin B1) deficiency. Heavy drinking causes inflammation of the stomach lining and digestive tract, which reduces the body's ability to absorb vitamins. This depletion of B1, B3 (Niacin), and B9 (Folate) contributes to fatigue, cognitive fog, and overall feeling of malaise that hangovers bring."
      },
      {
        type: 'text',
        body: "This is exactly why Pulsar Patch targets these specific pathways: Glutathione and NAC for acetaldehyde neutralization, B Vitamins to replenish what alcohol depletes, and Ginger Extract for stomach support."
      },
    ],
    sources: [
      { name: 'Journal of Clinical Medicine: Inflammatory Response to Alcohol', url: 'https://www.mdpi.com/2077-0383/9/7/2081' },
      { name: 'NIH PMC: Alcohol Hangover Mechanisms and Mediators', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6761819/' },
      { name: 'Cedars-Sinai: The Science of Hangovers', url: 'https://www.cedars-sinai.org/stories-and-insights/healthy-living/science-of-hangovers' },
      { name: 'Wiley: Inflammation, Oxidative Stress and Hangover', url: 'https://onlinelibrary.wiley.com/doi/10.1111/acer.15396' },
      { name: 'Alcohol and Drug Foundation: Thiamine Deficiency', url: 'https://adf.org.au/insights/alcohol-related-thiamine-deficiency/' },
    ]
  },

  'science-behind-pulsar': {
    title: 'THE SCIENCE BEHIND PULSAR PATCH',
    category: 'SCIENCE',
    tagColor: 'bg-pulsar-pink',
    date: 'MAY 8',
    heroImg: imgScienceBehindPulsar,
    heroAlt: 'An abstract 3D render of a DNA double helix wrapped in green vines and pink flowers on a pale background',
    heroImgCredit: { photographer: 'Google DeepMind', url: 'https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-depicts-how-ai-could-assist-in-genomic-studies-and-its-applications-it-was-created-by-artist-nidia-dias-as-part-of-the-18069422/' },
    heroDescription: "We don't hide behind proprietary blends or vague claims. Here's a breakdown of every ingredient in a Pulsar Patch and what the research says.",
    content: [
      {
        type: 'text',
        body: "Every ingredient in Pulsar Patch was selected for a specific reason. No filler, no fluff, no ingredients added just to make the label look impressive. Six ingredients, each backed by published research, working together to support your body after a night of drinking."
      },
      {
        type: 'heading',
        body: "GLUTATHIONE: YOUR BODY'S MASTER ANTIOXIDANT"
      },
      {
        type: 'text',
        body: "Glutathione is often called the body's master antioxidant, and for good reason. A 2024 randomized, double-blind, placebo-controlled clinical trial published in Nutrients found that glutathione supplementation significantly decreased acetaldehyde concentration in serum compared to the control group. The study, which measured blood alcohol and acetaldehyde levels at multiple intervals, demonstrated that GSH can effectively lower alcohol absorption and promote acetaldehyde elimination during alcohol metabolism."
      },
      {
        type: 'text',
        body: "Additional research published in MDPI's Antioxidants journal found that a combination of cysteine and glutathione prevented ethanol-induced hangover and liver damage through modulation of the Nrf2 signaling pathway in both HepG2 cells and mice models."
      },
      {
        type: 'heading',
        body: "NAC: YOUR LIVER'S BACKUP GENERATOR"
      },
      {
        type: 'text',
        body: "NAC (N-Acetylcysteine) is a precursor to Glutathione, meaning your body uses it to produce more of that critical antioxidant. A randomized trial published in Scientific Reports examined NAC's role in hangover prevention. The study found that NAC, as a glutathione donor, has the potential to decrease oxidative stress on the liver during ethanol degradation. Animal studies within the same research showed that subjects pretreated with NAC prior to ethanol ingestion had measurably decreased oxidative stress on the liver."
      },
      {
        type: 'heading',
        body: "B VITAMINS: REPLENISHING WHAT ALCOHOL TAKES"
      },
      {
        type: 'text',
        body: "Alcohol depletes B Vitamins rapidly and significantly. According to the Alcohol and Drug Foundation, up to 80% of heavy drinkers develop thiamine (B1) deficiency because alcohol causes inflammation of the stomach lining and digestive tract, reducing the body's ability to absorb these essential nutrients."
      },
      {
        type: 'text',
        body: "Vitamin B1 (Thiamine) supports energy metabolism and neurological function. Vitamin B3 (Niacin) aids in cellular repair and circulation. Research referenced by the British Journal of General Practice suggests that niacin may help improve alcohol clearance from the body. Vitamin B9 (Folate) supports cell regeneration. A 2012 German study found that B2 and B9 had positive effects on comfort during alcohol recovery. Pulsar delivers all three transdermally throughout the night, replenishing what your body loses while drinking."
      },
      {
        type: 'heading',
        body: "GINGER EXTRACT: NATURE'S STOMACH SOOTHER"
      },
      {
        type: 'text',
        body: "Ginger has been used for centuries to combat nausea and support digestion. A systematic review published in the European Review for Medical and Pharmacological Sciences confirmed ginger's effectiveness for treating nausea across multiple contexts. Separate research published in the Journal of Applied Pharmaceutical Sciences found that ginger rhizome extract validated the traditional use of ginger as a hangover remedy, showing it reduced withdrawal-induced deficits and decreased learned preference to ethanol by 53% at therapeutic doses."
      },
      {
        type: 'image',
        img: imgScienceBehindPulsarGinger,
        alt: 'Fresh ginger root, sliced ginger, and a tin of ground ginger powder on a light background',
        source: 'Photo via Pexels'
      },
      {
        type: 'heading',
        body: "WHY TRANSDERMAL DELIVERY MATTERS"
      },
      {
        type: 'text',
        body: "When you take a pill or drink a supplement, it has to survive your stomach acid, get absorbed through your intestinal wall, and pass through your liver before reaching your bloodstream. This process, called first-pass metabolism, can significantly reduce the potency of what you're taking."
      },
      {
        type: 'text',
        body: "According to research published by the NIH's National Center for Biotechnology Information, transdermal drug delivery bypasses first-pass GI and hepatic metabolism, resulting in increased bioavailability. Pharmacy Times further notes that transdermal administration allows prolonged release while minimizing adverse effects due to lower drug peak concentrations. The ingredients go from patch to skin to bloodstream, maintaining their potency and delivering at a steady, controlled rate."
      },
    ],
    sources: [
      { name: 'Nutrients: GSH and Alcohol Metabolism Clinical Trial (2024)', url: 'https://www.mdpi.com/2072-6643/16/19/3262' },
      { name: 'Scientific Reports: NAC in Prevention of Hangover', url: 'https://www.nature.com/articles/s41598-021-92676-0' },
      { name: 'MDPI Antioxidants: Cysteine and Glutathione Prevent Hangover', url: 'https://www.mdpi.com/2076-3921/12/10/1885' },
      { name: 'NIH PMC: Transdermal Drug Delivery', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2700785/' },
      { name: 'Pharmacy Times: The Patch vs Oral Route', url: 'https://www.pharmacytimes.com/view/delivery-methods-the-patch-versus-the-oral-route' },
      { name: 'Alcohol and Drug Foundation: Thiamine Deficiency', url: 'https://adf.org.au/insights/alcohol-related-thiamine-deficiency/' },
      { name: 'European Review: Ginger for Nausea and Vomiting', url: 'https://pubmed.ncbi.nlm.nih.gov/25912592/' },
      { name: 'JAPS: Ginger Rhizome Extract and Alcohol', url: 'https://japsonline.com/admin/php/uploads/3647_pdf.pdf' },
      { name: 'British Journal of General Practice: Vitamin B for Alcoholics', url: 'https://bjgp.org/content/67/656/134' },
    ]
  },

  'hangovers-arent-inevitable': {
    title: "HANGOVERS AREN'T INEVITABLE!",
    category: 'SCIENCE',
    tagColor: 'bg-pulsar-pink',
    date: 'MAY 8',
    heroImg: imgHangoversArentInevitable,
    heroAlt: 'A bright, airy modern bedroom with morning light coming through a large window',
    heroImgCredit: { photographer: 'Max Vakhtbovych', url: 'https://www.pexels.com/photo/cozy-bedroom-with-modern-furniture-and-decorative-elements-6890413/' },
    heroDescription: "For years we've accepted hangovers as the price of a good time. But the science says otherwise. Here's why you don't have to settle for feeling terrible.",
    content: [
      {
        type: 'text',
        body: "There's a cultural belief that hangovers are just something you have to deal with. You went out, you had fun, now you pay the price. But that mindset ignores decades of research into how the body processes alcohol and what can actually be done to support that process."
      },
      {
        type: 'heading',
        body: "YOUR BODY ALREADY KNOWS HOW TO RECOVER"
      },
      {
        type: 'text',
        body: "Your liver is remarkably good at its job. It has enzymes specifically designed to break down alcohol and its toxic byproducts. The problem isn't that your body can't handle alcohol. It's that heavy drinking overwhelms these systems and depletes the resources they need to function."
      },
      {
        type: 'text',
        body: "Research published in the NIH's PMC archive explains that the role of alcohol metabolism in hangover pathology is central: when glutathione levels drop and B Vitamins are stripped away, the recovery process slows down dramatically. The buildup of acetaldehyde and the resulting inflammatory response are what create the symptoms we call a hangover."
      },
      {
        type: 'image',
        img: imgPatchArm,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "THE DIFFERENCE BETWEEN SUFFERING AND SUPPORTING"
      },
      {
        type: 'text',
        body: "Most people try to fix a hangover after it's already started. Coffee, greasy food, more sleep. These are band-aids. The smarter approach is to support your body before and during the recovery process. That means replenishing the nutrients that alcohol depletes and giving your liver the antioxidant support it needs to keep up."
      },
      {
        type: 'text',
        body: "That's the principle behind Pulsar Patch. Applied before drinking, it delivers a steady stream of Glutathione, NAC, B Vitamins, and Ginger Extract throughout the night. Your body gets the support it needs exactly when it needs it. As research from Wiley's Alcohol, Clinical and Experimental Research demonstrates, addressing inflammation and oxidative stress (the main causes of hangover) proactively can make a meaningful difference."
      },
      {
        type: 'heading',
        body: "SMALL CHANGES, BIG DIFFERENCE"
      },
      {
        type: 'text',
        body: "Combine a Pulsar Patch with basic habits like eating before drinking, alternating with water, and getting enough sleep, and you'll notice a significant difference in how you feel the next day. Hangovers aren't inevitable. They're just a sign that your body needed a little more help than it got."
      },
    ],
    sources: [
      { name: 'NIH PMC: Role of Alcohol Metabolism in Hangover Pathology', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7692803/' },
      { name: 'Wiley: Inflammation, Oxidative Stress and Hangover', url: 'https://onlinelibrary.wiley.com/doi/10.1111/acer.15396' },
      { name: 'NIH PMC: Alcohol Hangover Mechanisms and Mediators', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6761819/' },
    ]
  },

  'low-calorie-margarita': {
    title: 'LOW CALORIE MARGARITA',
    category: 'RECIPES',
    tagColor: 'bg-[#FFA700]',
    date: 'MAY 8',
    heroImg: imgLowCalorieMargarita,
    heroAlt: 'Two light margarita cocktails over ice with fresh lime and lemon on a wooden serving tray',
    heroImgCredit: { photographer: 'alleksana', url: 'https://www.pexels.com/photo/photo-of-glasses-on-wooden-tray-4051401/' },
    heroDescription: "All the flavor of a classic margarita without the calorie guilt. This simple recipe keeps things light, fresh, and perfect for warm nights.",
    content: [
      {
        type: 'text',
        body: "A traditional margarita can pack 300 to 500 calories depending on the mix. Most of that comes from sugary syrups and pre-made mixes loaded with artificial ingredients. This version strips it back to the essentials for a clean, refreshing cocktail that won't wreck your goals. Inspired by the classic skinny margarita approach popularized by WellPlated and Joyful Healthy Eats, the key is using fresh citrus instead of bottled mixes."
      },
      {
        type: 'heading',
        body: "THE RECIPE"
      },
      {
        type: 'text',
        body: "2 oz blanco tequila (100% agave, always)\n1 oz fresh lime juice\n0.5 oz fresh orange juice\n0.5 oz agave nectar (or skip entirely for even fewer calories)\nSparkling water to top\nLime wheel and Tajin or salt rim\n\nShake the tequila, lime juice, orange juice, and agave with ice. Strain into a rimmed glass over fresh ice. Top with a splash of sparkling water. Garnish with a lime wheel."
      },
      {
        type: 'image',
        img: imgMargarita,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "WHY THIS VERSION WORKS"
      },
      {
        type: 'text',
        body: "Fresh citrus juice gives you the tartness and complexity that bottled mixes try to replicate with sugar. The natural sweetness of fresh orange juice replaces the need for orange liqueur, which is where most of the hidden calories live. The sparkling water adds volume and fizz without adding calories. Total damage: about 150 calories per cocktail. That's less than half of what you'd get at most bars."
      },
      {
        type: 'text',
        body: "For the best flavor, go with silver or blanco tequila. It's lighter, cleaner, and slightly lower in calories than aged varieties like reposado or a\u00f1ejo."
      },
      {
        type: 'heading',
        body: "PAIR IT WITH A PULSAR PATCH"
      },
      {
        type: 'text',
        body: "Going light on calories doesn't mean going light on fun. If you're having a few of these at a backyard hangout, apply a Pulsar Patch beforehand and enjoy your morning as much as your evening. Low calorie margaritas plus overnight hangover support. That's called planning ahead."
      },
    ],
    sources: [
      { name: 'WellPlated: Skinny Margarita', url: 'https://www.wellplated.com/skinny-margarita/' },
      { name: 'Joyful Healthy Eats: Skinny Margarita Recipe', url: 'https://www.joyfulhealthyeats.com/ultimate-skinny-margarita-recipe/' },
    ]
  },

  'fasted-old-fashion': {
    title: 'FASTED OLD FASHION FOR AFTER WORK',
    category: 'RECIPES',
    tagColor: 'bg-[#FFA700]',
    date: 'MAY 8',
    heroImg: imgFastedOldFashion,
    heroAlt: 'An Old Fashioned cocktail with a large ice cube and orange peel in a rocks glass on a dark marble surface',
    heroImgCredit: { photographer: 'Dextar Vision', url: 'https://www.pexels.com/photo/alcohol-beverage-in-glass-16444385/' },
    heroDescription: "A stripped-down, no-nonsense Old Fashioned that's perfect for unwinding after a long day. No syrup, no fuss, just a clean cocktail done right.",
    content: [
      {
        type: 'text',
        body: "The Old Fashioned is one of the oldest and most respected cocktails for a reason. Dating back to the 1800s, it lets the whiskey do the talking. This version leans even further into simplicity, cutting the sugar to a minimum while keeping all the warmth and character that makes this drink a classic. As The Kitchn puts it, the Old Fashioned is \"strong and simple\" and \"doesn't rely on mixers, soda, or sugary liqueurs.\""
      },
      {
        type: 'heading',
        body: "THE RECIPE"
      },
      {
        type: 'text',
        body: "2 oz bourbon or rye whiskey\n1 small barspoon of raw honey or demerara sugar\n2 dashes Angostura bitters\n1 dash orange bitters\nOrange peel\nLarge ice cube\n\nAdd the honey (or sugar with 2 teaspoons water) and bitters to a rocks glass. Stir to combine. Add the whiskey and one large ice cube. Stir gently for 15 to 20 seconds. Express the orange peel over the glass by twisting it skin-side down, then drop it in."
      },
      {
        type: 'image',
        img: imgFastedOldFashionWhiskey,
        alt: 'A bottle of bourbon whiskey beside a glass of whiskey over ice',
        source: 'Photo via Pexels'
      },
      {
        type: 'heading',
        body: "THE AFTER-WORK RITUAL"
      },
      {
        type: 'text',
        body: "There's something about making an Old Fashioned that forces you to slow down. The stirring, the ice, the orange peel. It's a five-minute ritual that draws a line between the workday and the evening. One well-made cocktail can do more for your mood than three rushed ones."
      },
      {
        type: 'heading',
        body: "KEEP TOMORROW SHARP"
      },
      {
        type: 'text',
        body: "If one turns into a few, you know the drill. A Pulsar Patch before the first sip keeps your morning on track. Because the point of an after-work drink is to relax, not to spend the next day recovering from it."
      },
    ],
    sources: [
      { name: 'The Kitchn: Old Fashioned Recipe', url: 'https://www.thekitchn.com/old-fashioned-recipe-23690466' },
      { name: "Maker's Mark: Bourbon Old Fashioned", url: 'https://www.makersmark.com/en-us/cocktails/old-fashioned' },
    ]
  },

  'best-low-regret-cocktails': {
    title: 'BEST LOW-REGRET COCKTAILS',
    category: 'RECIPES',
    tagColor: 'bg-[#FFA700]',
    date: 'MAY 8',
    heroImg: imgCocktailsBar,
    heroDescription: "Not all cocktails are created equal when it comes to how you feel the next day. Here are the best drinks for minimizing regret without minimizing fun.",
    content: [
      {
        type: 'text',
        body: "Some drinks hit different the next morning, and not in a good way. Sugary cocktails, dark liquors, and anything with artificial mixers tend to make hangovers worse. Research shows that congeners, the impurities produced during fermentation, vary widely between spirits and contribute significantly to hangover severity. But there are plenty of options that taste great and go easier on your body."
      },
      {
        type: 'heading',
        body: "1. VODKA SODA WITH LIME"
      },
      {
        type: 'text',
        body: "The gold standard of clean drinking. Vodka is one of the most distilled spirits, meaning fewer congeners. Pair it with soda water and fresh lime for a crisp, zero-sugar cocktail that won't slow you down. About 100 calories per drink."
      },
      {
        type: 'heading',
        body: "2. GIN AND TONIC (WITH QUALITY TONIC)"
      },
      {
        type: 'text',
        body: "Skip the high-fructose tonic water and reach for a premium brand with real quinine and less sugar (Fever-Tree or Q Mixers are solid picks). The botanicals in gin add complexity, and the tonic provides just enough sweetness. A classic that's lighter than it gets credit for."
      },
      {
        type: 'image',
        img: imgCocktailsBar,
        source: 'Photo by Unsplash'
      },
      {
        type: 'heading',
        body: "3. TEQUILA ON THE ROCKS"
      },
      {
        type: 'text',
        body: "Good tequila (100% agave, always) is one of the cleanest spirits you can drink. Sip it neat or on the rocks with a lime wedge. No mixer needed when the spirit is quality. Blanco for a crisp taste, reposado if you like a little warmth."
      },
      {
        type: 'heading',
        body: "4. RANCH WATER"
      },
      {
        type: 'text',
        body: "Tequila, Topo Chico, and lime. Three ingredients, zero sugar, maximum refreshment. This Texas favorite has taken over for good reason. It's light, hydrating (relatively speaking), and dangerously easy to drink. The mineral water adds a crispness you won't get from regular sparkling water."
      },
      {
        type: 'heading',
        body: "5. APEROL SPRITZ"
      },
      {
        type: 'text',
        body: "Lower in alcohol than most cocktails (around 11% ABV), the Aperol Spritz is a session-friendly option that looks and tastes like summer. Three parts prosecco, two parts Aperol, one part soda water, served over ice. At roughly 125 calories, it's one of the lightest options on any menu."
      },
      {
        type: 'heading',
        body: "THE SECRET INGREDIENT"
      },
      {
        type: 'text',
        body: "No matter which cocktail you choose, the smartest move is applying a Pulsar Patch before your first drink. Clean cocktails plus transdermal hangover defense. That's how you have a night worth remembering and a morning worth waking up for."
      },
    ],
    sources: [
      { name: 'NIH PMC: Alcohol Hangover Mechanisms (Congeners)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6761819/' },
    ]
  },
}
