export const cefrLevels = [
  { id: 'A1', band: 'Beginner', weeks: 4, summary: 'Very basic vocabulary, simple structures and first invitations or personal stories.' },
  { id: 'A2', band: 'Elementary', weeks: 4, summary: 'Clear slow conversations, simple directions and routine travel or service interactions.' },
  { id: 'B1', band: 'Pre-Intermediate', weeks: 4, summary: 'Everyday matters, explanations, needs, plans and familiar work or study contexts.' },
  { id: 'B1+', band: 'Intermediate', weeks: 4, summary: 'Easy everyday communication with a still-limited range of expression.' },
  { id: 'B2', band: 'Upper-Intermediate', weeks: 4, summary: 'Confident use with some noticeable gaps in accuracy, range and fluency.' },
  { id: 'B2+', band: 'Pre-Advanced', weeks: 4, summary: 'Confident reading, media comprehension and English-speaking job preparation.' },
  { id: 'C1', band: 'Advanced', weeks: 4, summary: 'Accurate reading, writing, lectures and complex professional communication.' },
  { id: 'C2', band: 'Proficiency', weeks: 4, summary: 'Near-full command, specialist terms and precise control of tone and nuance.' },
];

export const examEquivalences = [
  { exam: 'IELTS', A1: '', A2: '3.0 - 4.0', B1: '4.0 - 4.5', 'B1+': '4.5 - 5.0', B2: '5.0 - 6.0', 'B2+': '6.0 - 6.5', C1: '6.5 - 7.5', C2: '' },
  { exam: 'Cambridge', A1: '', A2: 'KET', B1: '', 'B1+': 'PET', B2: '', 'B2+': 'FCE', C1: 'CAE', C2: '' },
  { exam: 'TOEFL', A1: '', A2: '', B1: '', 'B1+': '35 - 45', B2: '46 - 65', 'B2+': '66 - 85', C1: '86 - 105', C2: '' },
  { exam: 'TOEIC', A1: '', A2: '255 - 400', B1: '405 - 600', 'B1+': '405 - 600', B2: '605 - 780', 'B2+': '605 - 780', C1: '785 - 900', C2: '' },
];

export const placementQuestions = [
  {
    id: 'placement-1',
    prompt: 'A neighbour says: "Morning. How are you?"',
    options: [
      { label: "I'm fine, thanks. And you?", level: 'A1', points: 1 },
      { label: "I'm rather well, although the weather has been unpredictable.", level: 'B1+', points: 4 },
      { label: 'I would challenge the premise of that question.', level: 'C1', points: 7 },
    ],
  },
  {
    id: 'placement-2',
    prompt: 'You are lost in a station and need simple directions.',
    options: [
      { label: 'Train where?', level: 'A1', points: 1 },
      { label: 'Could you tell me which platform I need?', level: 'A2', points: 2 },
      { label: 'Would you mind confirming whether this service stops at the city centre?', level: 'B2', points: 5 },
    ],
  },
  {
    id: 'placement-3',
    prompt: 'A colleague asks why you missed a meeting.',
    options: [
      { label: 'I had another call and forgot to check the time.', level: 'B1', points: 3 },
      { label: 'The meeting was not in my calendar, so I missed the notification.', level: 'B1+', points: 4 },
      { label: 'There was a scheduling conflict, and I should have flagged it earlier.', level: 'B2', points: 5 },
    ],
  },
  {
    id: 'placement-4',
    prompt: 'You disagree in a team discussion.',
    options: [
      { label: "I don't think so.", level: 'A2', points: 2 },
      { label: 'I see the point, but I think there is a simpler option.', level: 'B2', points: 5 },
      { label: 'I would frame the risk differently, because the constraint is not technical.', level: 'C1', points: 7 },
    ],
  },
  {
    id: 'placement-5',
    prompt: 'You watched a complex interview and need to summarise it.',
    options: [
      { label: 'It was about work and money.', level: 'A2', points: 2 },
      { label: 'The speaker explained why the company changed its hiring plan.', level: 'B2+', points: 6 },
      { label: 'The argument was nuanced, but the evidence felt selective.', level: 'C1', points: 7 },
    ],
  },
  {
    id: 'placement-6',
    prompt: 'You need precise tone in a high-stakes professional email.',
    options: [
      { label: 'Please send me the file.', level: 'A2', points: 2 },
      { label: 'Could you send the file when you have a moment?', level: 'B1+', points: 4 },
      { label: 'I appreciate the context; could you share the latest version before we finalise the proposal?', level: 'C2', points: 8 },
    ],
  },
];

export const recommendLevelFromPlacement = (answers) => {
  const total = answers.reduce((sum, value) => sum + Number(value || 0), 0);
  const average = total / Math.max(1, answers.length);
  if (average < 1.6) return cefrLevels[0];
  if (average < 2.6) return cefrLevels[1];
  if (average < 3.6) return cefrLevels[2];
  if (average < 4.6) return cefrLevels[3];
  if (average < 5.6) return cefrLevels[4];
  if (average < 6.6) return cefrLevels[5];
  if (average < 7.5) return cefrLevels[6];
  return cefrLevels[7];
};

export const variants = {
  'en-GB': {
    id: 'en-GB',
    short: 'UK',
    name: 'British English',
    culture: 'United Kingdom',
    voiceHint: 'Modern British pronunciation',
    hero: 'Practise modern British English through pubs, the Underground, UK offices, university life, football culture and daily London routines.',
    contexts: ['pub', 'underground', 'airport UK', 'office UK', 'university UK', 'football culture', 'London daily life'],
    characters: ['Maya', 'Oliver', 'Amelia', 'Noah'],
    tone: 'polite, understated and context-aware',
  },
  'en-US': {
    id: 'en-US',
    short: 'US',
    name: 'American English',
    culture: 'United States',
    voiceHint: 'General American pronunciation',
    hero: 'Practise American English through coffee shops, corporate meetings, college life, US airports, Netflix-style conversations and tech culture.',
    contexts: ['coffee shop', 'corporate meetings', 'college life', 'airport US', 'Netflix conversations', 'tech industry', 'daily conversations'],
    characters: ['Maya', 'Ava', 'Ethan', 'Grace'],
    tone: 'direct, warm and action-oriented',
  },
};

const levels = cefrLevels.map((level) => level.id);
const levelAt = (index) => levels[index % levels.length];

const comparisonRows = `
flat|apartment|Housing|neutral|Renting a home in a city.|I'm renting a flat near Camden.|I'm renting an apartment near Brooklyn.
lift|elevator|Buildings|neutral|Moving between floors in public buildings.|Take the lift to the fourth floor.|Take the elevator to the fourth floor.
holiday|vacation|Travel|neutral|Leisure travel and time away from work.|We're going on holiday in June.|We're going on vacation in June.
colour|color|Spelling|neutral|Regional spelling in writing.|I love the colour of that jacket.|I love the color of that jacket.
favourite|favorite|Spelling|neutral|Regional spelling in profiles and preferences.|What's your favourite film?|What's your favorite movie?
organise|organize|Work|neutral|Arranging files, people or tasks.|Can you organise the files today?|Can you organize the files today?
centre|center|Places|neutral|The middle of a town, building or service.|Meet me in the city centre.|Meet me downtown in the city center.
theatre|theater|Culture|neutral|Arts venues and entertainment plans.|The theatre opens at seven.|The theater opens at seven.
travelling|traveling|Travel|neutral|Regional spelling with doubled consonants.|She's travelling next week.|She's traveling next week.
cheque|check|Money|formal|Banking and payments.|I paid by cheque.|I paid by check.
driving licence|driver's license|Documents|formal|Official driving documents.|Bring your driving licence.|Bring your driver's license.
petrol|gas|Transport|neutral|Fuel for a car.|I need to buy petrol.|I need to get gas.
motorway|freeway|Transport|neutral|High-speed roads.|Join the motorway after the roundabout.|Get on the freeway after the light.
roundabout|traffic circle|Transport|neutral|Road junctions.|Take the second exit at the roundabout.|Take the second exit at the traffic circle.
pavement|sidewalk|Transport|neutral|Where pedestrians walk.|Stay on the pavement.|Stay on the sidewalk.
car park|parking lot|Transport|neutral|Where cars are parked.|The car park is full.|The parking lot is full.
boot|trunk|Cars|neutral|Rear storage space in a car.|Put the bags in the boot.|Put the bags in the trunk.
bonnet|hood|Cars|neutral|Panel over the engine.|Open the bonnet carefully.|Open the hood carefully.
lorry|truck|Transport|neutral|Large goods vehicle.|The lorry blocked the road.|The truck blocked the road.
queue|line|Everyday|neutral|Waiting in order.|There's a queue outside.|There's a line outside.
till|cash register|Shopping|neutral|Payment point in a shop.|Pay at the till.|Pay at the cash register.
shop|store|Shopping|neutral|Place to buy things.|I'm going to the shop.|I'm going to the store.
chemist|pharmacy|Health|neutral|Place to buy medicine.|I'll stop at the chemist.|I'll stop at the pharmacy.
takeaway|takeout|Food|neutral|Food ordered to eat elsewhere.|Let's get a takeaway.|Let's get takeout.
biscuit|cookie|Food|neutral|Sweet baked snack.|Would you like a biscuit?|Would you like a cookie?
crisps|chips|Food|neutral|Packaged potato snack.|I bought a packet of crisps.|I bought a bag of chips.
chips|fries|Food|neutral|Hot fried potato strips.|Fish and chips is classic.|Burgers and fries are classic.
aubergine|eggplant|Food|neutral|Purple vegetable.|Roast the aubergine.|Roast the eggplant.
courgette|zucchini|Food|neutral|Green squash.|Slice the courgette thinly.|Slice the zucchini thinly.
coriander|cilantro|Food|neutral|Fresh herb.|Add fresh coriander.|Add fresh cilantro.
rocket|arugula|Food|neutral|Peppery salad leaf.|The salad has rocket.|The salad has arugula.
fizzy drink|soda|Food|neutral|Carbonated drink.|Do you want a fizzy drink?|Do you want a soda?
sweets|candy|Food|neutral|Sugary treats.|Don't eat too many sweets.|Don't eat too much candy.
mince|ground beef|Food|neutral|Minced meat.|Use 500 grams of mince.|Use a pound of ground beef.
tin|can|Food|neutral|Food container.|Open a tin of tomatoes.|Open a can of tomatoes.
cling film|plastic wrap|Kitchen|neutral|Thin plastic food covering.|Cover it with cling film.|Cover it with plastic wrap.
hob|stovetop|Kitchen|neutral|Cooking surface.|Put the pan on the hob.|Put the pan on the stovetop.
cooker|stove|Kitchen|neutral|Cooking appliance.|The cooker is new.|The stove is new.
washing-up liquid|dish soap|Kitchen|neutral|Liquid for washing dishes.|We're out of washing-up liquid.|We're out of dish soap.
bin|trash can|Home|neutral|Container for rubbish.|Put it in the bin.|Put it in the trash can.
rubbish|trash|Home|neutral|Waste.|Take the rubbish out.|Take the trash out.
tap|faucet|Home|neutral|Water fixture.|Turn off the tap.|Turn off the faucet.
wardrobe|closet|Home|neutral|Place to hang clothes.|The coat is in the wardrobe.|The coat is in the closet.
garden|yard|Home|neutral|Outdoor home space.|The children are in the garden.|The kids are in the yard.
flatmate|roommate|Housing|neutral|Person sharing a home.|My flatmate is cooking.|My roommate is cooking.
fortnight|two weeks|Time|neutral|A period of fourteen days.|I'll be away for a fortnight.|I'll be away for two weeks.
autumn|fall|Time|neutral|Season after summer.|Autumn starts soon.|Fall starts soon.
bank holiday|public holiday|Culture|neutral|Public day off.|Monday is a bank holiday.|Monday is a public holiday.
football|soccer|Sport|neutral|Sport with a round ball.|Football is on tonight.|Soccer is on tonight.
match|game|Sport|neutral|Sports event.|The match starts at eight.|The game starts at eight.
pitch|field|Sport|neutral|Playing area.|The pitch is wet.|The field is wet.
kit|uniform|Sport|neutral|Team clothing.|The new kit is red.|The new uniform is red.
trainers|sneakers|Clothing|neutral|Casual sports shoes.|I bought new trainers.|I bought new sneakers.
jumper|sweater|Clothing|neutral|Warm knitted top.|Wear a jumper.|Wear a sweater.
trousers|pants|Clothing|neutral|Outer leg clothing.|Those trousers fit well.|Those pants fit well.
CV|resume|Work|formal|Job application document.|Send us your CV.|Send us your resume.
redundancy|layoff|Work|formal|Losing a job because the role is removed.|The company announced redundancies.|The company announced layoffs.
rota|schedule|Work|neutral|Shift plan.|Check the rota.|Check the schedule.
payslip|paystub|Work|formal|Document showing wages.|Download your payslip.|Download your paystub.
advert|ad|Media|neutral|Commercial message.|That advert is everywhere.|That ad is everywhere.
post|mail|Communication|neutral|Letters and parcels.|The post arrived early.|The mail arrived early.
postcode|ZIP code|Documents|formal|Address code.|What's your postcode?|What's your ZIP code?
full stop|period|Writing|neutral|Punctuation mark at sentence end.|Add a full stop here.|Add a period here.
maths|math|School|neutral|School subject.|Maths was difficult today.|Math was difficult today.
rubber|eraser|School|neutral|Object for removing pencil marks.|Can I borrow a rubber?|Can I borrow an eraser?
timetable|schedule|School|neutral|Planned list of times.|Check your timetable.|Check your schedule.
marks|grades|School|neutral|School scores.|She got high marks.|She got high grades.
headteacher|principal|School|formal|Leader of a school.|Talk to the headteacher.|Talk to the principal.
primary school|elementary school|School|formal|Early compulsory education.|My son is in primary school.|My son is in elementary school.
secondary school|high school|School|formal|Later school stage.|She teaches at a secondary school.|She teaches at a high school.
toilet|restroom|Everyday|neutral|Public facility.|Where's the toilet?|Where's the restroom?
loo|bathroom|Everyday|casual|Casual public or home facility.|I'm going to the loo.|I'm going to the bathroom.
mobile phone|cell phone|Technology|neutral|Personal phone.|My mobile phone is dead.|My cell phone is dead.
cashpoint|ATM|Money|neutral|Machine for withdrawing cash.|There's a cashpoint nearby.|There's an ATM nearby.
solicitor|lawyer|Law|formal|Legal professional.|Speak to a solicitor.|Speak to a lawyer.
estate agent|real estate agent|Housing|formal|Property professional.|Call the estate agent.|Call the real estate agent.
hire car|rental car|Travel|neutral|Car used temporarily.|We booked a hire car.|We booked a rental car.
starter|appetizer|Food|formal|First course in a meal.|We'll share a starter.|We'll share an appetizer.
main course|entree|Food|formal|Main dish on a menu.|What's your main course?|What's your entree?
bill|check|Food|neutral|Restaurant payment request.|Could we have the bill?|Could we have the check?
serviette|napkin|Food|formal|Table cloth for wiping hands.|Could I have a serviette?|Could I have a napkin?
plaster|band-aid|Health|neutral|Adhesive bandage.|Put a plaster on it.|Put a Band-Aid on it.
torch|flashlight|Everyday|neutral|Handheld light.|Bring a torch.|Bring a flashlight.
postbox|mailbox|Communication|neutral|Public box for letters.|Drop it in the postbox.|Drop it in the mailbox.
parcel|package|Communication|neutral|Delivered item.|Your parcel arrived.|Your package arrived.
ground floor|first floor|Buildings|neutral|Floor numbering.|Reception is on the ground floor.|Reception is on the first floor.
first floor|second floor|Buildings|neutral|Floor above ground level.|The office is on the first floor.|The office is on the second floor.
`.trim();

const curatedComparisonRows = `
nappy|diaper|Family|neutral|Baby care and parenting.|We need to change the nappy.|We need to change the diaper.
dummy|pacifier|Family|neutral|Baby comfort item.|The baby dropped the dummy.|The baby dropped the pacifier.
pram|stroller|Family|neutral|Baby transport.|The pram is by the door.|The stroller is by the door.
cot|crib|Family|neutral|Baby bed.|The cot is upstairs.|The crib is upstairs.
pushchair|stroller|Family|neutral|Child transport in daily life.|Fold the pushchair before boarding.|Fold the stroller before boarding.
fringe|bangs|Clothing|neutral|Hair style across the forehead.|She cut her fringe yesterday.|She cut her bangs yesterday.
dressing gown|bathrobe|Clothing|neutral|Loose robe worn at home.|I left my dressing gown upstairs.|I left my bathrobe upstairs.
waistcoat|vest|Clothing|formal|Sleeveless formal garment.|He wore a waistcoat to the wedding.|He wore a vest to the wedding.
vest|undershirt|Clothing|neutral|Sleeveless undergarment.|Pack a clean vest.|Pack a clean undershirt.
braces|suspenders|Clothing|neutral|Straps holding trousers or pants.|He wears braces with that suit.|He wears suspenders with that suit.
trainers|running shoes|Clothing|neutral|Casual athletic shoes.|Bring trainers for the gym.|Bring running shoes for the gym.
pyjamas|pajamas|Spelling|neutral|Night clothes and regional spelling.|I packed my pyjamas.|I packed my pajamas.
draught beer|draft beer|Food|neutral|Beer served from a tap.|Do you have draught beer?|Do you have draft beer?
pudding|dessert|Food|neutral|Sweet course after a meal.|What's for pudding?|What's for dessert?
candyfloss|cotton candy|Food|neutral|Spun sugar snack.|The fair sells candyfloss.|The fair sells cotton candy.
ice lolly|popsicle|Food|neutral|Frozen sweet on a stick.|Do you want an ice lolly?|Do you want a popsicle?
wholemeal bread|whole wheat bread|Food|neutral|Bread made with whole grain flour.|Buy wholemeal bread.|Buy whole wheat bread.
porridge|oatmeal|Food|neutral|Hot oat breakfast.|I had porridge for breakfast.|I had oatmeal for breakfast.
grill|broiler|Kitchen|neutral|Top heat in an oven.|Put it under the grill.|Put it under the broiler.
baking tray|baking sheet|Kitchen|neutral|Flat tray for oven cooking.|Use a baking tray.|Use a baking sheet.
tea towel|dish towel|Kitchen|neutral|Cloth for drying dishes.|Pass me the tea towel.|Pass me the dish towel.
washing powder|laundry detergent|Home|neutral|Soap for clothes washing.|We're out of washing powder.|We're out of laundry detergent.
dustbin|garbage can|Home|neutral|Outdoor rubbish container.|Put the bag in the dustbin.|Put the bag in the garbage can.
hoover|vacuum|Home|neutral|Vacuum cleaner used as a verb or noun.|I'll hoover the sitting room.|I'll vacuum the living room.
sitting room|living room|Home|neutral|Main shared room at home.|She's in the sitting room.|She's in the living room.
airing cupboard|linen closet|Home|neutral|Cupboard for towels and bedding.|The towels are in the airing cupboard.|The towels are in the linen closet.
boiler|water heater|Home|neutral|Equipment for heating water.|The boiler needs a service.|The water heater needs servicing.
estate|subdivision|Housing|neutral|Residential area or development.|They live on a quiet estate.|They live in a quiet subdivision.
council flat|public housing apartment|Housing|formal|Local authority housing.|She grew up in a council flat.|She grew up in a public housing apartment.
high street|main street|Shopping|neutral|Main shopping street.|The bank is on the high street.|The bank is on Main Street.
off-licence|liquor store|Shopping|neutral|Shop selling alcohol to take away.|There's an off-licence nearby.|There's a liquor store nearby.
charity shop|thrift store|Shopping|neutral|Second-hand shop for charity.|I found it in a charity shop.|I found it in a thrift store.
receipt|sales slip|Shopping|formal|Proof of purchase.|Keep the receipt for returns.|Keep the sales slip for returns.
cashier|checkout clerk|Shopping|neutral|Person taking payment.|Ask the cashier.|Ask the checkout clerk.
zebra crossing|crosswalk|Transport|neutral|Marked pedestrian crossing.|Use the zebra crossing.|Use the crosswalk.
pelican crossing|signalised crosswalk|Transport|formal|Pedestrian crossing with traffic lights.|Wait at the pelican crossing.|Wait at the signalized crosswalk.
give way|yield|Transport|neutral|Road sign or driving instruction.|Give way at the junction.|Yield at the intersection.
junction|intersection|Transport|neutral|Where roads meet.|Turn left at the junction.|Turn left at the intersection.
diversion|detour|Transport|neutral|Temporary alternative route.|Follow the diversion signs.|Follow the detour signs.
dual carriageway|divided highway|Transport|formal|Road with separated directions.|Join the dual carriageway.|Get on the divided highway.
number plate|license plate|Cars|neutral|Vehicle registration plate.|Check the number plate.|Check the license plate.
windscreen|windshield|Cars|neutral|Front car window.|The windscreen is cracked.|The windshield is cracked.
indicator|turn signal|Cars|neutral|Light showing direction.|Use your indicator.|Use your turn signal.
gearbox|transmission|Cars|neutral|System for changing gears.|The gearbox feels stiff.|The transmission feels stiff.
manual car|stick shift|Cars|neutral|Car with manual gears.|I drive a manual car.|I drive a stick shift.
tram|streetcar|Transport|neutral|Urban rail vehicle.|Take the tram into town.|Take the streetcar downtown.
single ticket|one-way ticket|Travel|neutral|Ticket for one direction.|I need a single ticket.|I need a one-way ticket.
return ticket|round-trip ticket|Travel|neutral|Ticket for going and coming back.|Buy a return ticket.|Buy a round-trip ticket.
reception|front desk|Travel|neutral|Hotel or office welcome desk.|Ask at reception.|Ask at the front desk.
left luggage|baggage storage|Travel|neutral|Place to store bags temporarily.|Use left luggage at the station.|Use baggage storage at the station.
hand luggage|carry-on luggage|Travel|neutral|Bag taken into the cabin.|Keep that in your hand luggage.|Keep that in your carry-on luggage.
queueing|lining up|Everyday|neutral|Waiting in order.|Queueing is normal here.|Lining up is normal here.
anti-clockwise|counterclockwise|Everyday|neutral|Direction of rotation.|Turn it anti-clockwise.|Turn it counterclockwise.
surname|last name|Documents|formal|Family name on forms.|Write your surname here.|Write your last name here.
forename|first name|Documents|formal|Given name on forms.|Enter your forename.|Enter your first name.
National Insurance number|Social Security number|Documents|formal|Government identity number for work and tax.|They asked for my National Insurance number.|They asked for my Social Security number.
solicitor's office|law office|Law|formal|Place to get legal help.|Meet me at the solicitor's office.|Meet me at the law office.
barrister|trial lawyer|Law|formal|Court advocate in many legal contexts.|The barrister addressed the court.|The trial lawyer addressed the court.
state school|public school|School|formal|Government-funded school.|She went to a state school.|She went to a public school.
public school|private school|School|formal|Fee-paying school in the UK.|He went to public school.|He went to private school.
fresher|freshman|School|casual|First-year university student.|Freshers arrive next week.|Freshmen arrive next week.
uni|college|School|casual|University in everyday speech.|I'm starting uni in September.|I'm starting college in September.
term|semester|School|neutral|Period in the academic year.|The autumn term starts soon.|The fall semester starts soon.
revision|review|School|neutral|Studying before an exam.|I need to do revision tonight.|I need to review tonight.
invigilator|proctor|School|formal|Person supervising an exam.|Ask the invigilator.|Ask the proctor.
A&E|ER|Health|neutral|Emergency hospital department.|She went to A&E.|She went to the ER.
GP surgery|doctor's office|Health|neutral|Local general practice.|Call the GP surgery.|Call the doctor's office.
chemist's prescription|pharmacy prescription|Health|formal|Medicine order handled by a pharmacy.|Collect the chemist's prescription.|Pick up the pharmacy prescription.
jab|shot|Health|casual|Injection or vaccine.|I had a flu jab.|I got a flu shot.
plait|braid|Appearance|neutral|Hair woven together.|She wore a plait.|She wore a braid.
aerial|antenna|Technology|neutral|Device for receiving signals.|The aerial is broken.|The antenna is broken.
programme|program|Spelling|neutral|TV show, event plan or software spelling.|The programme starts at nine.|The program starts at nine.
mobile data|cellular data|Technology|neutral|Internet connection through a phone network.|Turn on mobile data.|Turn on cellular data.
sat nav|GPS|Technology|neutral|Navigation device or app.|Use the sat nav.|Use the GPS.
brackets|parentheses|Writing|neutral|Round punctuation marks.|Put it in brackets.|Put it in parentheses.
inverted commas|quotation marks|Writing|neutral|Punctuation for quoted speech.|Use inverted commas here.|Use quotation marks here.
football boots|soccer cleats|Sport|neutral|Shoes for playing football or soccer.|Bring your football boots.|Bring your soccer cleats.
draw|tie|Sport|neutral|Equal score at the end.|The match was a draw.|The game was a tie.
nil|zero|Sport|neutral|No score in sport.|They won two-nil.|They won two-zero.
supporter|fan|Sport|neutral|Person following a team.|He's a loyal supporter.|He's a loyal fan.
fixture|scheduled game|Sport|formal|Planned sports match.|The fixture is on Saturday.|The scheduled game is on Saturday.
cinema|movie theater|Culture|neutral|Place where films or movies are shown.|We're going to the cinema tonight.|We're going to the movie theater tonight.
film|movie|Culture|neutral|A motion picture or story on screen.|That film was brilliant.|That movie was awesome.
series|TV show|Media|neutral|A programme with episodes.|Have you seen that new series?|Have you seen that new TV show?
programme|show|Media|neutral|Broadcast or scheduled entertainment.|The programme starts after the news.|The show starts after the news.
presenter|host|Media|neutral|Person leading a broadcast.|The presenter asked a sharp question.|The host asked a sharp question.
newsreader|news anchor|Media|formal|Person reading the news on television.|The newsreader sounded calm.|The news anchor sounded calm.
booking|reservation|Travel|neutral|Arrangement for a seat, room or service.|I made a booking for eight.|I made a reservation for eight.
receptionist|front desk clerk|Travel|neutral|Person greeting guests or visitors.|The receptionist has our key.|The front desk clerk has our key.
lift pass|ski pass|Travel|neutral|Ticket for ski lifts.|We bought a lift pass online.|We bought a ski pass online.
service station|rest area|Travel|neutral|Roadside place for fuel, food and toilets.|Let's stop at the service station.|Let's stop at the rest area.
coach|bus|Transport|neutral|Long-distance passenger vehicle.|The coach leaves at six.|The bus leaves at six.
railway station|train station|Transport|neutral|Place where trains stop.|Meet me at the railway station.|Meet me at the train station.
platform number|track number|Transport|neutral|Number identifying where a train departs.|Check the platform number.|Check the track number.
flyover|overpass|Transport|neutral|Road bridge over another road.|Go over the flyover.|Go over the overpass.
underpass|pedestrian tunnel|Transport|neutral|Path below a road or railway.|Use the underpass.|Use the pedestrian tunnel.
roadworks|roadwork|Transport|neutral|Repairs or construction on a road.|Roadworks are causing delays.|Roadwork is causing delays.
diversion route|detour route|Transport|neutral|Alternative route around a closure.|Follow the diversion route.|Follow the detour route.
hire|rent|Services|neutral|Pay to use something temporarily.|Can we hire bikes here?|Can we rent bikes here?
queue number|line number|Services|neutral|Number used while waiting for service.|Take a queue number.|Take a line number.
customer services|customer service|Services|formal|Support department for customers.|Contact customer services.|Contact customer service.
enquiry|inquiry|Services|formal|Question or request for information.|I have an enquiry about my bill.|I have an inquiry about my bill.
complaint form|complaint form|Services|formal|Document for reporting a problem.|Fill in the complaint form.|Fill out the complaint form.
ring back|call back|Communication|neutral|Return a phone call.|I'll ring you back later.|I'll call you back later.
engaged tone|busy signal|Communication|neutral|Phone sound when a line is unavailable.|I got an engaged tone.|I got a busy signal.
answerphone|voicemail|Communication|neutral|Recorded phone message service.|Leave it on the answerphone.|Leave it on voicemail.
postman|mail carrier|Communication|neutral|Person delivering letters.|The postman came early.|The mail carrier came early.
worktop|countertop|Kitchen|neutral|Flat kitchen surface.|Wipe the worktop after cooking.|Wipe the countertop after cooking.
grater|shredder|Kitchen|neutral|Tool for cutting food into small pieces.|Use the cheese grater.|Use the cheese shredder.
food cupboard|pantry|Kitchen|neutral|Storage area for food.|The pasta is in the food cupboard.|The pasta is in the pantry.
washing machine|washer|Home|neutral|Machine for washing clothes.|The washing machine is noisy.|The washer is noisy.
tumble dryer|dryer|Home|neutral|Machine for drying clothes.|Use the tumble dryer.|Use the dryer.
block of flats|apartment building|Housing|neutral|Building with many homes.|She lives in a block of flats.|She lives in an apartment building.
letting agent|rental agent|Housing|formal|Person arranging property rental.|Email the letting agent.|Email the rental agent.
deposit scheme|security deposit account|Housing|formal|Protected rental deposit system.|Check the deposit scheme.|Check the security deposit account.
council tax|property tax|Housing|formal|Local tax connected with property.|Council tax is due monthly.|Property tax is due monthly.
pension scheme|retirement plan|Work|formal|Workplace savings for retirement.|Join the pension scheme.|Join the retirement plan.
notice period|notice period|Work|formal|Required time before leaving a job or tenancy.|My notice period is one month.|My notice period is one month.
annual leave|paid time off|Work|formal|Paid holiday from work.|I booked annual leave.|I used paid time off.
sick note|doctor's note|Work|formal|Medical note for absence.|HR asked for a sick note.|HR asked for a doctor's note.
probation period|probationary period|Work|formal|Trial period at a new job.|The probation period is three months.|The probationary period is three months.
training course|training program|Work|neutral|Organised learning at work.|The training course starts Monday.|The training program starts Monday.
marking scheme|grading rubric|School|formal|Rules used to assess work.|Read the marking scheme.|Read the grading rubric.
revision notes|study notes|School|neutral|Notes used before an exam.|I lost my revision notes.|I lost my study notes.
module|course|University|neutral|Unit of university study.|This module is difficult.|This course is difficult.
coursework|assignments|University|formal|Assessed work during a course.|Coursework is due Friday.|Assignments are due Friday.
lecturer|professor|University|formal|University teacher.|Ask your lecturer after class.|Ask your professor after class.
mark|grade|University|neutral|Score for assessed work.|I got a good mark.|I got a good grade.
fancy dress|costume party|Culture|neutral|Party where people wear costumes.|It's a fancy dress party.|It's a costume party.
stag do|bachelor party|Culture|casual|Celebration before a wedding for a groom.|He's planning a stag do.|He's planning a bachelor party.
hen do|bachelorette party|Culture|casual|Celebration before a wedding for a bride.|She's going on a hen do.|She's going to a bachelorette party.
pantomime|holiday theatre show|Culture|neutral|Traditional British stage comedy at Christmas.|We're seeing a pantomime.|We're seeing a holiday theater show.
take a decision|make a decision|Work|formal|Choose a course of action.|We need to take a decision today.|We need to make a decision today.
different to|different from|Writing|neutral|Common comparison structure.|This option is different to the last one.|This option is different from the last one.
at the weekend|on the weekend|Time|neutral|During Saturday or Sunday.|I'll call at the weekend.|I'll call on the weekend.
Monday to Friday|Monday through Friday|Time|neutral|Workweek range.|We're open Monday to Friday.|We're open Monday through Friday.
half past seven|seven thirty|Time|neutral|Time expression.|The train leaves at half past seven.|The train leaves at seven thirty.
`.trim();

const comparisonSeedRows = `${comparisonRows}\n${curatedComparisonRows}`.trim();

const pairs = comparisonSeedRows.split('\n').map((row, index) => {
  const [uk, us, category, formality, situation, exampleUK, exampleUS] = row.split('|');
  return { id: `seed-${index + 1}`, uk, us, category, formality, situation, exampleUK, exampleUS };
});

const scenarios = [
  ['pub', 'A local asks what you want before last orders.', 'Order naturally and keep the rhythm of the conversation.'],
  ['underground', 'The platform is crowded and the announcement is fast.', 'Ask for help without freezing.'],
  ['airport UK', 'Border control asks about your stay.', 'Answer clearly with natural politeness.'],
  ['office UK', 'A teammate asks you to sort out a meeting room.', 'Reply with the right tone and regional vocabulary.'],
  ['university UK', 'A tutor asks about your assignment.', 'Explain your need and ask for clarification.'],
  ['football culture', 'Friends invite you to watch the match.', 'React naturally and join the plan.'],
  ['London daily life', 'You need directions near the city centre.', 'Ask, listen and confirm the route.'],
  ['coffee shop', 'A barista is waiting during the morning rush.', 'Order quickly and naturally.'],
  ['corporate meetings', 'A manager asks for a project update.', 'Give a concise professional answer.'],
  ['college life', 'A classmate asks about your schedule.', 'Share routine information naturally.'],
  ['airport US', 'An agent asks about your connecting flight.', 'Answer clearly with American travel vocabulary.'],
  ['Netflix conversations', 'A friend reacts dramatically to a message.', 'Choose a natural cinematic response.'],
  ['tech industry', 'A lead asks if the feature is ready.', 'Reply with precision and confidence.'],
  ['daily conversations', 'A neighbour starts small talk.', 'Keep the conversation warm and simple.'],
  ['hotel', 'The room key stopped working.', 'Explain the problem and ask for help.'],
  ['restaurant', 'The server asks if everything is okay.', 'Respond naturally and request one thing.'],
  ['doctor appointment', 'You need to describe a small problem.', 'Use simple health vocabulary.'],
  ['job interview', 'The interviewer asks about your experience.', 'Answer with relevant examples.'],
  ['shopping', 'You need a different size.', 'Ask politely and react to the reply.'],
  ['bank', 'You need to ask about a payment.', 'Clarify the issue safely.'],
  ['support call', 'The agent needs details from you.', 'Explain the issue step by step.'],
  ['presentation', 'You need to introduce a short idea.', 'Use direct, confident English.'],
  ['remote onboarding', 'A colleague explains a tool.', 'Confirm understanding and ask one question.'],
  ['product review', 'The team discusses a change.', 'Agree, disagree or ask for evidence.'],
  ['weekend plans', 'A friend suggests a plan.', 'Accept, decline or suggest an alternative.'],
];

const phraseTemplates = [
  ['Could you show me where the {term} is?', 'Can you show me where the {term} is?'],
  ['I need to sort out the {term} before lunch.', 'I need to take care of the {term} before lunch.'],
  ['Is this the right {term} for the form?', 'Is this the right {term} for the form?'],
  ['I left my bag near the {term}.', 'I left my bag near the {term}.'],
  ['Could we check the {term} together?', 'Can we check the {term} together?'],
  ['That sounds like the wrong {term}.', 'That sounds like the wrong {term}.'],
  ['I need a quick word about the {term}.', 'I need to talk quickly about the {term}.'],
  ['Could you add the {term} to the booking?', 'Can you add the {term} to the reservation?'],
  ['The {term} is missing from the email.', 'The {term} is missing from the email.'],
  ['I was told to bring the {term}.', 'They told me to bring the {term}.'],
  ['Let me double-check the {term} before we leave.', 'Let me double-check the {term} before we leave.'],
  ['That {term} sounds more natural in this context.', 'That {term} sounds more natural in this context.'],
  ['I would use {term} with a local audience.', 'I would use {term} with a local audience.'],
  ['The sign says {term}, so we are in the right place.', 'The sign says {term}, so we are in the right place.'],
  ['Could you pronounce {term} again slowly?', 'Can you pronounce {term} again slowly?'],
  ['This scene needs {term}, not a translated phrase.', 'This scene needs {term}, not a translated phrase.'],
];

const makeBank = (variant) =>
  Array.from({ length: 500 }, (_, index) => {
    const seed = pairs[index % pairs.length];
    const level = levelAt(index);
    const term = variant === 'en-GB' ? seed.uk : seed.us;
    const counterpart = variant === 'en-GB' ? seed.us : seed.uk;
    const baseExample = variant === 'en-GB' ? seed.exampleUK : seed.exampleUS;
    const template = phraseTemplates[index % phraseTemplates.length][variant === 'en-GB' ? 0 : 1];
    const example = index < pairs.length ? baseExample : template.replace('{term}', term);
    const context = scenarios[index % scenarios.length];
    const seedCycle = Math.floor(index / pairs.length);
    return {
      id: `${variant}-${String(index + 1).padStart(3, '0')}`,
      variant,
      level,
      term,
      counterpart,
      category: seed.category,
      formality: seed.formality,
      situation: seed.situation,
      context: context[0],
      example,
      speech: example,
      explanation:
        variant === 'en-GB'
          ? `${term} is the natural British choice in ${seed.situation.toLowerCase()} contexts${seedCycle ? `, especially in ${context[0]}` : ''}.`
          : `${term} is the natural American choice in ${seed.situation.toLowerCase()} contexts${seedCycle ? `, especially in ${context[0]}` : ''}.`,
      culture:
        variant === 'en-GB'
          ? 'Use British spelling and local wording consistently in UK-facing conversations and writing.'
          : 'Use American wording and spelling inside the American English module and US-facing contexts.',
      difficulty: 1 + (index % 5),
      tags: [level, seed.category, seed.formality, context[0]],
      source: index < pairs.length ? 'curated' : 'contextual-variation',
    };
  });

export const wordBanks = {
  'en-GB': makeBank('en-GB'),
  'en-US': makeBank('en-US'),
};

export const phraseBank = {
  'en-GB': Array.from({ length: 300 }, (_, index) => {
    const word = wordBanks['en-GB'][index % wordBanks['en-GB'].length];
    const template = phraseTemplates[index % phraseTemplates.length][0];
    return {
      id: `gb-phrase-${index + 1}`,
      variant: 'en-GB',
      level: levelAt(index),
      context: word.context,
      focus: word.category,
      text: template.replace('{term}', word.term),
      tip: 'Listen for sentence stress, weak forms and polite intonation before repeating.',
    };
  }),
  'en-US': Array.from({ length: 300 }, (_, index) => {
    const word = wordBanks['en-US'][index % wordBanks['en-US'].length];
    const template = phraseTemplates[index % phraseTemplates.length][1];
    return {
      id: `us-phrase-${index + 1}`,
      variant: 'en-US',
      level: levelAt(index),
      context: word.context,
      focus: word.category,
      text: template.replace('{term}', word.term),
      tip: 'Listen for rhythm, reductions and confident connected speech before repeating.',
    };
  }),
};

const idiomRows = `
not my cup of tea|not my thing|Something you do not enjoy.|Jazz is not my cup of tea.|Jazz is not really my thing.
take it with a pinch of salt|take it with a grain of salt|Do not fully believe it.|Take that rumour with a pinch of salt.|Take that rumor with a grain of salt.
touch wood|knock on wood|Avoid tempting fate after good news.|No delays so far, touch wood.|No delays so far, knock on wood.
storm in a teacup|tempest in a teapot|A small issue treated as huge.|It's a storm in a teacup.|It's a tempest in a teapot.
throw a spanner in the works|throw a wrench in the works|Create a problem that disrupts a plan.|That throws a spanner in the works.|That throws a wrench in the works.
bits and bobs|bits and pieces|Small mixed things.|I packed a few bits and bobs.|I packed a few bits and pieces.
chuffed to bits|thrilled|Very pleased.|I'm chuffed to bits.|I'm thrilled.
take the mickey|make fun of someone|Tease or mock someone.|Stop taking the mickey.|Stop making fun of me.
have a lie-in|sleep in|Stay in bed later than usual.|I had a lie-in on Sunday.|I slept in on Sunday.
give someone a ring|give someone a call|Phone someone.|Give me a ring later.|Give me a call later.
on the cards|in the cards|Likely to happen.|A promotion is on the cards.|A promotion is in the cards.
chalk and cheese|night and day|Very different.|Those two are chalk and cheese.|Those two are night and day.
in a right pickle|in a real jam|In a difficult situation.|We're in a right pickle.|We're in a real jam.
can't be bothered|don't feel like it|Not willing to do something.|I can't be bothered tonight.|I don't feel like it tonight.
give it a go|give it a shot|Try something.|Give it a go.|Give it a shot.
spot on|right on|Exactly correct.|Your answer is spot on.|Your answer is right on.
sorted|all set|Ready or solved.|We're sorted for Friday.|We're all set for Friday.
knackered|wiped out|Very tired.|I'm absolutely knackered.|I'm completely wiped out.
gutted|bummed out|Very disappointed.|I'm gutted about it.|I'm bummed out about it.
over the moon|over the moon|Very happy.|She's over the moon.|She's over the moon.
`.trim().split('\n').map((row) => {
  const [uk, us, meaning, exampleUK, exampleUS] = row.split('|');
  return { uk, us, meaning, exampleUK, exampleUS };
});

const makeIdioms = (variant) =>
  Array.from({ length: 100 }, (_, index) => {
    const seed = idiomRows[index % idiomRows.length];
    return {
      id: `${variant}-idiom-${index + 1}`,
      variant,
      level: levelAt(index + 2),
      expression: variant === 'en-GB' ? seed.uk : seed.us,
      counterpart: variant === 'en-GB' ? seed.us : seed.uk,
      meaning: seed.meaning,
      example: variant === 'en-GB' ? seed.exampleUK : seed.exampleUS,
      context: scenarios[(index * 3) % scenarios.length][0],
      culturalNote:
        variant === 'en-GB'
          ? 'British idioms often carry dry humour or understatement.'
          : 'American idioms often sound direct, energetic and conversational.',
    };
  });

export const idiomBank = {
  'en-GB': makeIdioms('en-GB'),
  'en-US': makeIdioms('en-US'),
};

export const interactiveScenarios = Array.from({ length: 50 }, (_, index) => {
  const base = scenarios[index % scenarios.length];
  const gb = wordBanks['en-GB'][(index * 7) % wordBanks['en-GB'].length];
  const us = wordBanks['en-US'][(index * 7) % wordBanks['en-US'].length];
  const variant = index % 2 === 0 ? 'en-GB' : 'en-US';
  return {
    id: `scene-${index + 1}`,
    variant,
    level: levelAt(index),
    context: base[0],
    title: base[0].replace(/\b\w/g, (letter) => letter.toUpperCase()),
    setup: base[1],
    mission: base[2],
    characters: variant === 'en-GB' ? ['Maya', 'Oliver'] : ['Maya', 'Ava'],
    target: variant === 'en-GB' ? gb.term : us.term,
    dialogue: [
      {
        speaker: 'Local',
        text: variant === 'en-GB' ? `Could you check the ${gb.term} before we go?` : `Can you check the ${us.term} before we go?`,
      },
      {
        speaker: 'You',
        text: variant === 'en-GB' ? `Sure, I can sort that out.` : `Sure, I can take care of that.`,
      },
    ],
    choices: [
      { label: variant === 'en-GB' ? 'Reply politely and keep it brief.' : 'Reply clearly and keep it moving.', score: 94 },
      { label: 'Translate word by word from Portuguese.', score: 42 },
      { label: 'Use a very formal sentence in a casual scene.', score: 58 },
    ],
  };
});

export const netflixScenes = [
  {
    id: 'nf-uk-1',
    variant: 'en-GB',
    level: 'B1',
    genre: 'British workplace comedy',
    title: 'Last Orders',
    setup: 'A colleague arrives late at a pub quiz.',
    line: "You're late. The quiz has already started.",
    options: [
      { text: "Sorry, the lift was packed and I got stuck upstairs.", score: 95, feedback: 'Natural British vocabulary and casual apology.' },
      { text: 'Sorry, the elevator was packed.', score: 70, feedback: 'Understandable, but it shifts the scene towards American English.' },
      { text: 'Apologies for my delayed presence.', score: 48, feedback: 'Too formal for a relaxed pub scene.' },
    ],
  },
  {
    id: 'nf-us-1',
    variant: 'en-US',
    level: 'B1',
    genre: 'American city drama',
    title: 'Coffee Run',
    setup: 'A barista is waiting while the line grows behind you.',
    line: 'Next in line. What can I get started for you?',
    options: [
      { text: 'Can I get an iced latte and a blueberry muffin?', score: 96, feedback: 'Fast, natural and very common in a US coffee shop.' },
      { text: 'May I have one cold coffee?', score: 62, feedback: 'Polite but not natural for this fast service context.' },
      { text: 'I fancy a latte, please.', score: 55, feedback: 'Fancy sounds British in this scene.' },
    ],
  },
  {
    id: 'nf-global-1',
    variant: 'mixed',
    level: 'B2',
    genre: 'Tech thriller',
    title: 'Ship It',
    setup: 'A global team debates whether the release is ready.',
    line: 'Can we ship this without breaking production?',
    options: [
      { text: "The tests pass, but I'd like one more review before we deploy.", score: 92, feedback: 'Clear, professional and natural in global tech teams.' },
      { text: 'It is probably fine, innit?', score: 39, feedback: 'Too casual and regionally marked for a critical decision.' },
      { text: 'The code is brilliant and definitely not dodgy.', score: 56, feedback: 'Real words, but the tone is not professional.' },
    ],
  },
];

export const thinkingPrompts = [
  {
    id: 'think-1',
    level: 'A1',
    visual: 'A train platform, a sign and a clock',
    prompt: 'You need to get across the city. What do you check first?',
    options: {
      'en-GB': ['the timetable', 'the petrol', 'the biscuit'],
      'en-US': ['the schedule', 'the gas', 'the cookie'],
    },
    correct: 0,
  },
  {
    id: 'think-2',
    level: 'A2',
    visual: 'A coffee counter with people waiting',
    prompt: 'The server is ready. What do you say?',
    options: {
      'en-GB': ['Could I have a flat white, please?', 'Where is the motorway?', 'I lost my trainers.'],
      'en-US': ['Can I get an iced latte?', 'Where is the pavement?', 'I lost my jumper.'],
    },
    correct: 0,
  },
  {
    id: 'think-3',
    level: 'B1',
    visual: 'A desk, a document and a hiring manager',
    prompt: 'They ask for your application document. What do you send?',
    options: {
      'en-GB': ['my CV', 'my ZIP code', 'my sneakers'],
      'en-US': ['my resume', 'my postcode', 'my trainers'],
    },
    correct: 0,
  },
];

export const achievements = [
  { id: 'first-scene', title: 'First Scene', description: 'Complete one immersive scene.' },
  { id: 'streak-3', title: 'Three-Day Rhythm', description: 'Study for three days in a row.' },
  { id: 'pronunciation-85', title: 'Clear Voice', description: 'Score 85+ in pronunciation.' },
  { id: 'flashcard-20', title: 'Active Memory', description: 'Review twenty flashcards.' },
  { id: 'netflix-90', title: 'Scene Naturalness', description: 'Score 90+ in Netflix English Mode.' },
  { id: 'exporter', title: 'Data Owner', description: 'Export your local progress.' },
];

export const filterByLevel = (items, level) => {
  const filtered = items.filter((item) => item.level === level);
  return filtered.length ? filtered : items;
};

export const contentStats = {
  britishWords: wordBanks['en-GB'].length,
  americanWords: wordBanks['en-US'].length,
  comparisonSeeds: pairs.length,
  curatedSeeds: pairs.length,
  phrases: 300,
  ukIdioms: idiomBank['en-GB'].length,
  usIdioms: idiomBank['en-US'].length,
  scenarios: interactiveScenarios.length,
};
