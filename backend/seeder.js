const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/skillsub_db";

// Define Schemas
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, required: true },
    alternateEmail: { type: String },
    fullName: { type: String },
    phoneNumber: { type: String },
    profilePictureUrl: { type: String },
}, { timestamps: true });

const AddressSchema = new mongoose.Schema({
    label: { type: String, required: true },
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    is_default: { type: Boolean, default: false },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pickup_info: { type: String },
    about: { type: String },
    accepts_subscription: { type: Boolean, default: false },
    addressId: { type: String, ref: "Address", required: true },
    shop_banner: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ShopCategory" },
}, { timestamps: true });

const ProductCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    shopId: { type: mongoose.Types.ObjectId, ref: "Shop" },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    base_price: { type: Number, required: true, min: 0 },
    stock_quantity: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" }],
}, { timestamps: true });

const OrderItemSchema = new mongoose.Schema({
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
}, { timestamps: true });

const SubscriptionPlanSchema = new mongoose.Schema({
    frequency: { type: Number, required: true, min: 1 },
    price_per_cycle: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: false },
    productId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] }],
    quantity: { type: Number, min: 1, default: 1 },
}, { timestamps: true });

const SubscriptionSchema = new mongoose.Schema({
    status: { type: String, required: true, default: "active" },
    start_date: { type: Date, required: true },
    remaining_cycle: { type: Number, required: true, min: 1, default: 1 },
    subscription_planId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
    delivery_type: { type: String, required: true, default: "standard" },
    schedule_for: { type: Date },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    orderItemsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
    provider: { type: String, default: "esewa" },
    status: { type: String, required: true, default: "completed" },
    amount: { type: Number, required: true, min: 0 },
    paid_at: { type: Date, default: Date.now },
    orderId: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
}, { timestamps: true });

const ShopCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Address = mongoose.model('Address', AddressSchema);
const Shop = mongoose.model('Shop', ShopSchema);
const ShopCategory = mongoose.model('ShopCategory', ShopCategorySchema);
const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);
const Product = mongoose.model('Product', ProductSchema);
const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);
const Order = mongoose.model('Order', OrderSchema);
const Payment = mongoose.model('Payment', PaymentSchema);

// User IDs
const vendorId1 = new mongoose.Types.ObjectId("69931cadbdb67cec3d290c23"); // Shop owner
const vendorId2 = new mongoose.Types.ObjectId("697dbeb89e90001cff960ed5"); // Shop owner
const customerId = new mongoose.Types.ObjectId("697dfd29477a1cdb684fdcd8"); // Customer

// Users data (seed first)
const usersData = [
    {
        _id: vendorId2,
        email: "sanket@gmail.com",
        password: "Sanket@1",
        username: "sanket",
        role: "shop",
        alternateEmail: "ssass@gmail.com",
        fullName: "ram Sharma",
        phoneNumber: "98763192182321",
        profilePictureUrl: "/uploads/seed-11.png",
    },
    {
        _id: customerId,
        email: "aloo@gmail.com",
        password: "alooaloo",
        username: "aloo",
        role: "customer",
        alternateEmail: "aloo121@gmail.com",
        fullName: "sddaawwa Sharma",
        phoneNumber: "+977 9840030334",
        profilePictureUrl: "/uploads/seed-12.png",
    },
    {
        _id: vendorId1,
        email: "shop@gmail.com",
        password: "shopshop",
        username: "shop",
        role: "shop",
    },
];

// Shop banners served from backend/uploads (copied from local screenshots)
const shopBanners = [
    "/uploads/seed-1.png",
    "/uploads/seed-2.png",
    "/uploads/seed-3.png",
    "/uploads/seed-4.png",
    "/uploads/seed-5.png",
    "/uploads/seed-6.png",
    "/uploads/seed-7.png",
    "/uploads/seed-8.png",
    "/uploads/seed-9.png",
    "/uploads/seed-10.png",
];

// Shop categories (skilled trades)
const shopCategoriesData = [
    { name: "Plumbing", description: "Licensed plumbers for drains, pipes, water heaters, and fixtures" },
    { name: "Electrical", description: "Certified electricians for wiring, panels, lighting, and safety inspections" },
    { name: "HVAC & Climate", description: "Heating, cooling, ventilation, and air quality specialists" },
    { name: "Appliance Repair", description: "Repair and maintenance for kitchen, laundry, and home appliances" },
    { name: "Locksmith & Security", description: "Locks, rekeying, smart security, and home security audits" },
    { name: "Landscaping & Lawn", description: "Lawn care, tree and hedge work, irrigation, and seasonal upkeep" },
    { name: "Painting & Drywall", description: "Interior/exterior painting, drywall repair, and finishing work" },
    { name: "Carpentry & Handyman", description: "Assembly, mounting, repairs, and general handyman services" },
    { name: "Pest Control", description: "Inspections, treatments, and recurring pest protection plans" },
    { name: "Cleaning Services", description: "Standard, deep, and move-in/out home cleaning services" }
];

// Address data for vendors and customer
const addressesData = [
    // Vendor 1 addresses
    {
        label: "Home",
        line1: "123 Main Street",
        city: "New York",
        state: "NY",
        country: "USA",
        lat: 40.7128,
        lng: -74.0060,
        is_default: true,
        userId: vendorId1
    },
    {
        label: "Office",
        line1: "456 Business Ave, Suite 200",
        city: "New York",
        state: "NY",
        country: "USA",
        lat: 40.7589,
        lng: -73.9851,
        is_default: false,
        userId: vendorId1
    },
    {
        label: "Warehouse",
        line1: "789 Industrial Pkwy",
        city: "Brooklyn",
        state: "NY",
        country: "USA",
        lat: 40.6782,
        lng: -73.9442,
        is_default: false,
        userId: vendorId1
    },
    // Vendor 2 addresses
    {
        label: "Home",
        line1: "321 Oak Street",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        is_default: true,
        userId: vendorId2
    },
    {
        label: "Store Location",
        line1: "654 Commerce Blvd",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        lat: 34.0407,
        lng: -118.2468,
        is_default: false,
        userId: vendorId2
    },
    {
        label: "Distribution Center",
        line1: "987 Logistics Way",
        city: "Long Beach",
        state: "CA",
        country: "USA",
        lat: 33.7701,
        lng: -118.1937,
        is_default: false,
        userId: vendorId2
    },
    // Customer addresses
    {
        label: "Home",
        line1: "555 Oak Lane",
        city: "Chicago",
        state: "IL",
        country: "USA",
        lat: 41.8781,
        lng: -87.6298,
        is_default: true,
        userId: customerId
    },
    {
        label: "Work",
        line1: "777 Corporate Drive",
        city: "Chicago",
        state: "IL",
        country: "USA",
        lat: 41.8854,
        lng: -87.6182,
        is_default: false,
        userId: customerId
    },
    {
        label: "Apartment",
        line1: "999 Residential Ave",
        city: "Evanston",
        state: "IL",
        country: "USA",
        lat: 42.0451,
        lng: -87.6767,
        is_default: false,
        userId: customerId
    }
];

// Service provider names
const shopNames = [
    "Rapid Flow Plumbing",
    "BrightLine Electrical",
    "ClimateCare Services",
    "FixIt Appliance Co.",
    "SecureHome Locksmiths",
    "GreenScape Pros",
    "FreshCoat Painters",
    "Handy Solutions",
    "ShieldGuard Pest Control",
    "SparkleClean Home"
];

// Service category names (per provider)
const categoryTemplates = [
    ["Drain Services", "Water Heaters", "Leak Repair", "Fixtures", "Maintenance Plans"],
    ["Inspections", "Wiring", "Lighting", "Safety Devices", "Smart Home"],
    ["AC Services", "Heating", "Air Quality", "Ductwork", "Tune-Up Plans"],
    ["Kitchen Appliances", "Laundry", "Refrigeration", "Small Appliances", "Care Plans"],
    ["Locks", "Smart Security", "Rekeying", "Safes", "Security Audits"],
    ["Lawn Care", "Trees & Hedges", "Irrigation", "Seasonal", "Care Plans"],
    ["Interior", "Exterior", "Drywall", "Prep & Finish", "Touch-Up Plans"],
    ["Assembly", "Repairs", "Mounting", "Carpentry", "Visit Plans"],
    ["Inspections", "Treatments", "Prevention", "Wildlife", "Protection Plans"],
    ["Standard Cleaning", "Deep Cleaning", "Move Services", "Specialty", "Recurring Plans"]
];

// Service templates (each service is stored as a Product row)
const productTemplates = [
    // Rapid Flow Plumbing services
    [
        { name: "Drain Cleaning", basePrice: 89.99, description: "Professional drain unclogging and cleaning service" },
        { name: "Water Heater Inspection", basePrice: 79.99, description: "Full water heater safety and efficiency check" },
        { name: "Leak Detection", basePrice: 99.99, description: "Electronic leak detection for hidden pipe leaks" },
        { name: "Faucet Replacement", basePrice: 119.99, description: "Removal and installation of new faucet, parts extra" },
        { name: "Toilet Repair", basePrice: 109.99, description: "Running, clogged, or leaking toilet repair" },
        { name: "Pipe Re-lining", basePrice: 349.99, description: "Trenchless pipe re-lining per section" },
        { name: "Sump Pump Service", basePrice: 149.99, description: "Sump pump testing, cleaning, and tune-up" },
        { name: "Garbage Disposal Install", basePrice: 129.99, description: "New garbage disposal installation" },
        { name: "Showerhead Upgrade", basePrice: 69.99, description: "Water-saving showerhead replacement" },
        { name: "Water Pressure Check", basePrice: 59.99, description: "Whole-home water pressure diagnostic" },
        { name: "Sewer Camera Inspection", basePrice: 199.99, description: "Video inspection of sewer and drain lines" },
        { name: "Water Softener Service", basePrice: 139.99, description: "Water softener maintenance and salt refill" },
        { name: "Emergency Plumbing Callout", basePrice: 159.99, description: "Same-day emergency plumbing visit" },
        { name: "Outdoor Spigot Repair", basePrice: 89.99, description: "Hose bib and outdoor spigot repair" },
        { name: "Whole-Home Plumbing Audit", basePrice: 249.99, description: "Comprehensive plumbing system health check" }
    ],
    // BrightLine Electrical services
    [
        { name: "Panel Safety Inspection", basePrice: 129.99, description: "Electrical panel inspection and load review" },
        { name: "Outlet & GFCI Testing", basePrice: 79.99, description: "Testing and replacement assessment of outlets" },
        { name: "Surge Protector Install", basePrice: 149.99, description: "Whole-home surge protection installation" },
        { name: "Wiring Audit", basePrice: 199.99, description: "Full home wiring safety audit" },
        { name: "Ceiling Fan Install", basePrice: 119.99, description: "Ceiling fan mounting and wiring" },
        { name: "Light Fixture Install", basePrice: 99.99, description: "Indoor light fixture replacement" },
        { name: "EV Charger Install", basePrice: 499.99, description: "Level 2 EV charger installation" },
        { name: "Smoke Detector Service", basePrice: 69.99, description: "Smoke/CO detector testing and replacement" },
        { name: "Circuit Breaker Replacement", basePrice: 159.99, description: "Faulty breaker diagnosis and replacement" },
        { name: "Smart Switch Setup", basePrice: 89.99, description: "Smart switch and dimmer installation" },
        { name: "Outdoor Lighting Install", basePrice: 179.99, description: "Landscape and security lighting install" },
        { name: "Generator Hookup Check", basePrice: 229.99, description: "Backup generator connection inspection" },
        { name: "Doorbell Camera Install", basePrice: 109.99, description: "Video doorbell wiring and setup" },
        { name: "Dedicated Circuit Install", basePrice: 249.99, description: "New dedicated circuit for appliances" },
        { name: "Whole-Home Electrical Audit", basePrice: 299.99, description: "Comprehensive electrical safety report" }
    ],
    // ClimateCare Services (HVAC)
    [
        { name: "AC Tune-Up", basePrice: 109.99, description: "Seasonal air conditioner tune-up and clean" },
        { name: "Furnace Inspection", basePrice: 119.99, description: "Furnace safety and efficiency inspection" },
        { name: "Filter Replacement", basePrice: 49.99, description: "HVAC filter replacement visit" },
        { name: "Duct Cleaning", basePrice: 299.99, description: "Full home air duct cleaning" },
        { name: "Thermostat Install", basePrice: 129.99, description: "Smart thermostat installation and setup" },
        { name: "Refrigerant Check", basePrice: 89.99, description: "Refrigerant level check and top-up assessment" },
        { name: "Heat Pump Service", basePrice: 149.99, description: "Heat pump inspection and maintenance" },
        { name: "Blower Motor Service", basePrice: 139.99, description: "Blower motor cleaning and lubrication" },
        { name: "Air Quality Test", basePrice: 99.99, description: "Indoor air quality assessment" },
        { name: "Humidifier Install", basePrice: 199.99, description: "Whole-home humidifier installation" },
        { name: "Condenser Coil Cleaning", basePrice: 119.99, description: "Outdoor condenser coil deep clean" },
        { name: "Vent Sealing", basePrice: 159.99, description: "Duct and vent leak sealing" },
        { name: "Emergency HVAC Callout", basePrice: 179.99, description: "Same-day heating/cooling emergency visit" },
        { name: "Mini-Split Service", basePrice: 169.99, description: "Ductless mini-split cleaning and check" },
        { name: "Seasonal HVAC Package", basePrice: 249.99, description: "Combined spring/fall system service" }
    ],
    // FixIt Appliance Co. services
    [
        { name: "Washer Repair", basePrice: 129.99, description: "Washing machine diagnosis and repair" },
        { name: "Dryer Vent Cleaning", basePrice: 99.99, description: "Dryer vent and duct fire-safety cleaning" },
        { name: "Refrigerator Repair", basePrice: 149.99, description: "Fridge cooling and component repair" },
        { name: "Dishwasher Maintenance", basePrice: 109.99, description: "Dishwasher deep clean and tune-up" },
        { name: "Oven Calibration", basePrice: 89.99, description: "Oven temperature calibration service" },
        { name: "Microwave Repair", basePrice: 79.99, description: "Built-in microwave diagnosis and repair" },
        { name: "Ice Maker Repair", basePrice: 119.99, description: "Ice maker and water line service" },
        { name: "Range Hood Service", basePrice: 99.99, description: "Range hood cleaning and motor check" },
        { name: "Freezer Diagnostic", basePrice: 89.99, description: "Freezer temperature and seal diagnostic" },
        { name: "Cooktop Repair", basePrice: 139.99, description: "Gas/electric cooktop element repair" },
        { name: "Garbage Disposal Repair", basePrice: 109.99, description: "Jammed or leaking disposal repair" },
        { name: "Appliance Install", basePrice: 129.99, description: "New appliance hookup and testing" },
        { name: "Annual Appliance Checkup", basePrice: 199.99, description: "All-appliance yearly maintenance visit" },
        { name: "Wine Cooler Service", basePrice: 149.99, description: "Wine cooler temperature and seal service" },
        { name: "Emergency Appliance Callout", basePrice: 159.99, description: "Same-day appliance emergency visit" }
    ],
    // SecureHome Locksmiths services
    [
        { name: "Lock Rekey", basePrice: 69.99, description: "Rekey existing locks to new keys" },
        { name: "Smart Lock Install", basePrice: 149.99, description: "Smart lock installation and app setup" },
        { name: "Deadbolt Install", basePrice: 99.99, description: "New deadbolt installation" },
        { name: "Home Security Audit", basePrice: 129.99, description: "Full entry-point security assessment" },
        { name: "Lockout Assistance", basePrice: 89.99, description: "Non-destructive home lockout entry" },
        { name: "Safe Installation", basePrice: 199.99, description: "Home safe anchoring and installation" },
        { name: "Mailbox Lock Replacement", basePrice: 49.99, description: "Mailbox lock swap with new keys" },
        { name: "Window Lock Service", basePrice: 59.99, description: "Window lock repair and upgrade" },
        { name: "Keypad Entry Setup", basePrice: 139.99, description: "Keypad entry system installation" },
        { name: "High-Security Lock Upgrade", basePrice: 179.99, description: "Bump/pick-resistant lock upgrade" },
        { name: "Garage Lock Service", basePrice: 79.99, description: "Garage and side-door lock service" },
        { name: "Master Key System", basePrice: 249.99, description: "Master key system design and install" },
        { name: "Door Reinforcement", basePrice: 119.99, description: "Strike plate and frame reinforcement" },
        { name: "CCTV Consultation", basePrice: 99.99, description: "Camera placement and system consultation" },
        { name: "Annual Security Checkup", basePrice: 159.99, description: "Yearly locks and security review" }
    ],
    // GreenScape Pros services
    [
        { name: "Lawn Mowing", basePrice: 59.99, description: "Full lawn mow, edge, and blow" },
        { name: "Hedge Trimming", basePrice: 89.99, description: "Hedge and shrub shaping service" },
        { name: "Seasonal Cleanup", basePrice: 149.99, description: "Spring/fall yard cleanup and haul-away" },
        { name: "Irrigation Check", basePrice: 79.99, description: "Sprinkler system inspection and adjustment" },
        { name: "Fertilization Treatment", basePrice: 99.99, description: "Seasonal lawn fertilization application" },
        { name: "Aeration Service", basePrice: 119.99, description: "Core aeration for healthier turf" },
        { name: "Tree Pruning", basePrice: 179.99, description: "Small tree pruning and shaping" },
        { name: "Mulching", basePrice: 129.99, description: "Garden bed mulch delivery and spread" },
        { name: "Weed Control", basePrice: 69.99, description: "Targeted weed treatment service" },
        { name: "Sod Installation", basePrice: 299.99, description: "New sod installation per zone" },
        { name: "Sprinkler Repair", basePrice: 109.99, description: "Sprinkler head and line repair" },
        { name: "Leaf Removal", basePrice: 89.99, description: "Full-yard leaf removal service" },
        { name: "Garden Bed Design", basePrice: 199.99, description: "Garden bed layout and planting plan" },
        { name: "Gutter Clearing", basePrice: 99.99, description: "Gutter and downspout clearing" },
        { name: "Monthly Lawn Package", basePrice: 139.99, description: "Recurring full-service lawn visit" }
    ],
    // FreshCoat Painters services
    [
        { name: "Interior Room Painting", basePrice: 299.99, description: "Single room walls painting, paint included" },
        { name: "Exterior Touch-Up", basePrice: 199.99, description: "Exterior trim and siding touch-up" },
        { name: "Drywall Patch", basePrice: 89.99, description: "Hole patching and surface blending" },
        { name: "Ceiling Painting", basePrice: 179.99, description: "Ceiling refresh per room" },
        { name: "Trim & Baseboard Painting", basePrice: 149.99, description: "Trim, doors, and baseboard repaint" },
        { name: "Wallpaper Removal", basePrice: 169.99, description: "Wallpaper stripping and wall prep" },
        { name: "Cabinet Refinishing", basePrice: 349.99, description: "Kitchen cabinet sanding and refinish" },
        { name: "Deck Staining", basePrice: 249.99, description: "Deck cleaning and stain application" },
        { name: "Texture Matching", basePrice: 129.99, description: "Wall texture repair and matching" },
        { name: "Color Consultation", basePrice: 59.99, description: "In-home paint color consultation" },
        { name: "Garage Floor Coating", basePrice: 299.99, description: "Epoxy garage floor coating" },
        { name: "Fence Painting", basePrice: 189.99, description: "Fence painting or staining per section" },
        { name: "Popcorn Ceiling Removal", basePrice: 279.99, description: "Popcorn texture removal and smooth finish" },
        { name: "Accent Wall", basePrice: 139.99, description: "Single accent wall design and paint" },
        { name: "Annual Touch-Up Visit", basePrice: 159.99, description: "Yearly whole-home paint touch-up" }
    ],
    // Handy Solutions services
    [
        { name: "Furniture Assembly", basePrice: 79.99, description: "Flat-pack furniture assembly per item" },
        { name: "Door Repair", basePrice: 99.99, description: "Sticking, sagging, or squeaky door repair" },
        { name: "Cabinet Repair", basePrice: 109.99, description: "Cabinet hinge and drawer repair" },
        { name: "TV Mounting", basePrice: 89.99, description: "Wall-mount TV installation with cable tidy" },
        { name: "Shelf Installation", basePrice: 69.99, description: "Floating and bracket shelf install" },
        { name: "Drywall Anchoring", basePrice: 59.99, description: "Heavy item anchoring into drywall/studs" },
        { name: "Weatherstripping", basePrice: 79.99, description: "Door and window weatherstrip replacement" },
        { name: "Caulking Service", basePrice: 69.99, description: "Kitchen and bath re-caulking" },
        { name: "Deck Board Replacement", basePrice: 149.99, description: "Damaged deck board replacement" },
        { name: "Baby-Proofing", basePrice: 119.99, description: "Home baby-proofing installation package" },
        { name: "Picture Hanging Package", basePrice: 49.99, description: "Gallery wall and picture hanging" },
        { name: "Window Screen Repair", basePrice: 59.99, description: "Screen re-mesh and frame repair" },
        { name: "General Handyman Hour", basePrice: 89.99, description: "One hour of general handyman work" },
        { name: "Closet Organizer Install", basePrice: 159.99, description: "Closet system assembly and mounting" },
        { name: "Monthly Handyman Visit", basePrice: 129.99, description: "Recurring monthly fix-it visit" }
    ],
    // ShieldGuard Pest Control services
    [
        { name: "Pest Inspection", basePrice: 89.99, description: "Full home pest inspection and report" },
        { name: "General Pest Treatment", basePrice: 129.99, description: "Interior and perimeter pest treatment" },
        { name: "Termite Inspection", basePrice: 109.99, description: "Termite activity inspection" },
        { name: "Rodent Proofing", basePrice: 149.99, description: "Entry sealing and rodent exclusion" },
        { name: "Ant Treatment", basePrice: 99.99, description: "Targeted ant colony treatment" },
        { name: "Mosquito Yard Treatment", basePrice: 119.99, description: "Seasonal mosquito barrier spray" },
        { name: "Bed Bug Inspection", basePrice: 139.99, description: "Bed bug detection and assessment" },
        { name: "Wasp Nest Removal", basePrice: 129.99, description: "Wasp and hornet nest removal" },
        { name: "Cockroach Treatment", basePrice: 149.99, description: "Cockroach elimination program" },
        { name: "Spider Treatment", basePrice: 99.99, description: "Interior/exterior spider treatment" },
        { name: "Flea & Tick Treatment", basePrice: 119.99, description: "Home and yard flea/tick treatment" },
        { name: "Crawl Space Treatment", basePrice: 179.99, description: "Crawl space pest and moisture treatment" },
        { name: "Bird Deterrent Install", basePrice: 159.99, description: "Bird spike and deterrent installation" },
        { name: "Wildlife Exclusion", basePrice: 199.99, description: "Humane wildlife exclusion service" },
        { name: "Quarterly Protection Plan", basePrice: 169.99, description: "Recurring quarterly pest protection" }
    ],
    // SparkleClean Home services
    [
        { name: "Standard Home Clean", basePrice: 119.99, description: "Full standard clean for up to 3 bedrooms" },
        { name: "Deep Clean", basePrice: 219.99, description: "Top-to-bottom deep cleaning service" },
        { name: "Move-Out Clean", basePrice: 249.99, description: "Move-in/move-out full property clean" },
        { name: "Window Washing", basePrice: 99.99, description: "Interior and reachable exterior windows" },
        { name: "Carpet Shampoo", basePrice: 149.99, description: "Hot-water carpet extraction per area" },
        { name: "Oven & Fridge Clean", basePrice: 89.99, description: "Appliance interior detail clean" },
        { name: "Bathroom Deep Scrub", basePrice: 79.99, description: "Detailed bathroom sanitization" },
        { name: "Post-Renovation Clean", basePrice: 269.99, description: "Dust and debris removal after remodels" },
        { name: "Garage Cleanout", basePrice: 159.99, description: "Garage sweep, sort, and clean" },
        { name: "Upholstery Cleaning", basePrice: 129.99, description: "Sofa and chair upholstery cleaning" },
        { name: "Tile & Grout Cleaning", basePrice: 139.99, description: "Tile and grout restoration clean" },
        { name: "Mattress Cleaning", basePrice: 99.99, description: "Mattress deep clean and deodorize" },
        { name: "Pressure Washing", basePrice: 189.99, description: "Driveway and patio pressure wash" },
        { name: "Green Cleaning Package", basePrice: 129.99, description: "Eco-friendly products full clean" },
        { name: "Biweekly Cleaning Plan", basePrice: 109.99, description: "Recurring biweekly home cleaning" }
    ]
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Payment.deleteMany({});
        await Order.deleteMany({ userId: customerId });
        await Subscription.deleteMany({ userId: customerId });
        await SubscriptionPlan.deleteMany({});
        await OrderItem.deleteMany({});
        await Address.deleteMany({ userId: { $in: [vendorId1, vendorId2, customerId] } });
        await Shop.deleteMany({ userId: { $in: [vendorId1, vendorId2] } });
        await ShopCategory.deleteMany({});
        await ProductCategory.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({ _id: { $in: [vendorId1, vendorId2, customerId] } });
        console.log('✅ Existing data cleared\n');

        // Create users first — hash passwords so they match the bcrypt-based
        // login flow (login uses bcrypt.compare, so plaintext seeds cannot log in).
        console.log('👥 Creating users...');
        const usersToInsert = await Promise.all(
            usersData.map(async (u) => ({ ...u, password: await bcryptjs.hash(u.password, 10) }))
        );
        const users = await User.insertMany(usersToInsert);
        console.log(`✅ Created ${users.length} users\n`);

        // Create shop categories (universal)
        console.log('🏷️  Creating shop categories...');
        const shopCategories = await ShopCategory.insertMany(shopCategoriesData);
        console.log(`✅ Created ${shopCategories.length} shop categories\n`);

        // Create addresses
        console.log('📍 Creating addresses...');
        const addresses = await Address.insertMany(addressesData);
        console.log(`✅ Created ${addresses.length} addresses\n`);

        // Create shops
        console.log('🏪 Creating shops...');
        const shops = [];
        let shopIndex = 0;
        
        // Assign shop categories to providers (one trade category per provider)
        const shopCategoryAssignments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        for (let i = 0; i < 2; i++) {
            const userId = i === 0 ? vendorId1 : vendorId2;
            const userAddresses = addresses.filter(addr => addr.userId.toString() === userId.toString());
            
            for (let j = 0; j < 5; j++) {
                const shop = await Shop.create({
                    name: shopNames[shopIndex],
                    pickup_info: `Service dispatch from ${userAddresses[j % userAddresses.length].line1}`,
                    about: `Welcome to ${shopNames[shopIndex]}! Licensed, background-checked professionals with satisfaction guaranteed.`,
                    accepts_subscription: true, // All shops accept subscriptions now
                    addressId: userAddresses[j % userAddresses.length]._id.toString(),
                    shop_banner: shopBanners[shopIndex % shopBanners.length],
                    userId: userId,
                    categoryId: shopCategories[shopCategoryAssignments[shopIndex]]._id
                });
                shops.push(shop);
                shopIndex++;
            }
        }
        console.log(`✅ Created ${shops.length} shops\n`);

        // Create product categories and products
        console.log('📦 Creating product categories and products...');
        let totalCategories = 0;
        let totalProducts = 0;

        for (let i = 0; i < shops.length; i++) {
            const shop = shops[i];
            const categories = [];

            // Create 5 categories per shop
            for (let j = 0; j < 5; j++) {
                const category = await ProductCategory.create({
                    name: categoryTemplates[i][j],
                    description: `${categoryTemplates[i][j]} for ${shop.name}`,
                    shopId: shop._id
                });
                categories.push(category);
                totalCategories++;
            }

            // Create 15 products per shop
            for (let k = 0; k < 15; k++) {
                const productTemplate = productTemplates[i][k];
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const additionalCategory = categories[Math.floor(Math.random() * categories.length)];
                
                await Product.create({
                    name: productTemplate.name,
                    description: productTemplate.description,
                    base_price: productTemplate.basePrice,
                    stock_quantity: Math.floor(Math.random() * 100) + 20, // 20-120 items
                    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0, // 0-30% discount randomly
                    shopId: shop._id,
                    categoryId: [randomCategory._id, additionalCategory._id]
                });
                totalProducts++;
            }

            const assignedCategory = shopCategories.find(cat => cat._id.toString() === shop.categoryId.toString());
            console.log(`  ✅ Shop: ${shop.name} (${assignedCategory?.name || 'Unknown'}) - Created 5 categories and 15 products`);
        }

        console.log(`\n✅ Created ${totalCategories} product categories`);
        console.log(`✅ Created ${totalProducts} products\n`);

        // Create order-items, subscription-plans, subscriptions, orders, and payments
        console.log('🧾 Creating order-items, subscription-plans, subscriptions, orders, and payments...');

        const allProducts = await Product.find({}).select('_id base_price discount shopId').lean();
        let totalOrderItems = 0;
        let totalSubscriptionPlans = 0;
        let totalSubscriptions = 0;
        let totalOrders = 0;
        let totalPayments = 0;

        // FLOW 1: Customer adds product -> create order-item -> create order (with exactly one orderItem) -> create payment
        const directOrderProductCount = Math.min(12, allProducts.length);
        for (let i = 0; i < directOrderProductCount; i++) {
            const product = allProducts[i];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const discountedPrice = Number((product.base_price * (1 - (product.discount || 0) / 100)).toFixed(2));

            const orderItem = await OrderItem.create({
                quantity,
                unit_price: discountedPrice,
                productId: product._id,
            });
            totalOrderItems++;

            const order = await Order.create({
                delivery_type: i % 2 === 0 ? 'standard' : 'express',
                schedule_for: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
                userId: customerId,
                shopId: product.shopId,
                orderItemsId: [orderItem._id], // exactly one orderItem even though field is array
            });
            totalOrders++;

            await Payment.create({
                provider: i % 3 === 0 ? 'khalti' : 'esewa',
                status: 'completed',
                amount: Number((discountedPrice * quantity).toFixed(2)),
                paid_at: new Date(),
                orderId: [order._id],
            });
            totalPayments++;
        }

        // FLOW 2: Customer adds product for subscription-plan -> create subscription -> create order (subscription only) -> create payment
        const subscriptionProducts = allProducts.slice(directOrderProductCount, directOrderProductCount + Math.min(10, allProducts.length - directOrderProductCount));
        for (let i = 0; i < subscriptionProducts.length; i++) {
            const product = subscriptionProducts[i];
            const frequency = [30, 90, 182][i % 3]; // monthly, quarterly, bi-annual maintenance visits
            const quantity = Math.floor(Math.random() * 2) + 1;
            const cyclePrice = Number((product.base_price * (1 - (product.discount || 0) / 100)).toFixed(2));

            const subscriptionPlan = await SubscriptionPlan.create({
                frequency,
                price_per_cycle: cyclePrice,
                active: true,
                productId: [product._id],
                quantity,
            });
            totalSubscriptionPlans++;

            const subscription = await Subscription.create({
                status: 'active',
                start_date: new Date(),
                remaining_cycle: (i % 6) + 2, // 2-7 remaining service visits
                subscription_planId: subscriptionPlan._id,
                userId: customerId,
                shopId: product.shopId,
            });
            totalSubscriptions++;

            const order = await Order.create({
                delivery_type: 'subscription',
                schedule_for: new Date(Date.now() + (i + 2) * 24 * 60 * 60 * 1000),
                subscriptionId: subscription._id,
                userId: customerId,
                shopId: product.shopId,
                // Intentionally no orderItemsId here to keep order as subscription-only
            });
            totalOrders++;

            const payment = await Payment.create({
                provider: 'esewa',
                status: 'completed',
                amount: Number((cyclePrice * quantity).toFixed(2)),
                paid_at: new Date(),
                orderId: [order._id],
            });
            totalPayments++;

            await Subscription.findByIdAndUpdate(subscription._id, { paymentId: payment._id });
        }

        console.log(`✅ Created ${totalOrderItems} order-items`);
        console.log(`✅ Created ${totalSubscriptionPlans} subscription-plans`);
        console.log(`✅ Created ${totalSubscriptions} subscriptions`);
        console.log(`✅ Created ${totalOrders} orders`);
        console.log(`✅ Created ${totalPayments} payments\n`);

        // Summary
        console.log('📊 Seeding Summary:');
        console.log('═══════════════════════════════════════');
        console.log(`🏷️  Total Shop Categories: ${shopCategories.length} (universal)`);
        console.log();
        console.log(`� Shop Owners (Vendors):`);
        console.log();
        console.log(`👤 Vendor 1 (${vendorId1}):`);
        console.log(`   - Addresses: 3`);
        console.log(`   - Shops: 5 (all accept subscriptions)`);
        console.log(`     • ${shopNames[0]} (${shopCategories[0].name})`);
        console.log(`     • ${shopNames[1]} (${shopCategories[1].name})`);
        console.log(`     • ${shopNames[2]} (${shopCategories[2].name})`);
        console.log(`     • ${shopNames[3]} (${shopCategories[3].name})`);
        console.log(`     • ${shopNames[4]} (${shopCategories[4].name})`);
        console.log(`   - Product Categories: 25 (5 per shop)`);
        console.log(`   - Products: 75 (15 per shop)`);
        console.log();
        console.log(`👤 Vendor 2 (${vendorId2}):`);
        console.log(`   - Addresses: 3`);
        console.log(`   - Shops: 5 (all accept subscriptions)`);
        console.log(`     • ${shopNames[5]} (${shopCategories[5].name})`);
        console.log(`     • ${shopNames[6]} (${shopCategories[6].name})`);
        console.log(`     • ${shopNames[7]} (${shopCategories[7].name})`);
        console.log(`     • ${shopNames[8]} (${shopCategories[8].name})`);
        console.log(`     • ${shopNames[9]} (${shopCategories[9].name})`);
        console.log(`   - Product Categories: 25 (5 per shop)`);
        console.log(`   - Products: 75 (15 per shop)`);
        console.log();
        console.log(`👤 Customer (${customerId}):`);
        console.log(`   - Addresses: 3`);
        console.log(`   - Order Items: seeded from product selections`);
        console.log(`   - Subscription Plans: seeded from product selections`);
        console.log(`   - Orders: each order has either one orderItemsId or one subscriptionId`);
        console.log(`   - Payments: created only after order creation`);
        console.log('═══════════════════════════════════════');
        console.log(`\n🎉 Database seeding completed successfully!`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

async function deleteSeededData() {
    try {
        console.log('🗑️  Starting data deletion...\n');

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Delete all seeded data
        console.log('🗑️  Deleting seeded data...');

        const paymentResult = await Payment.deleteMany({});
        console.log(`   ✅ Deleted ${paymentResult.deletedCount} payments`);

        const orderResult = await Order.deleteMany({ userId: customerId });
        console.log(`   ✅ Deleted ${orderResult.deletedCount} orders`);

        const subscriptionResult = await Subscription.deleteMany({ userId: customerId });
        console.log(`   ✅ Deleted ${subscriptionResult.deletedCount} subscriptions`);

        const subscriptionPlanResult = await SubscriptionPlan.deleteMany({});
        console.log(`   ✅ Deleted ${subscriptionPlanResult.deletedCount} subscription plans`);

        const orderItemResult = await OrderItem.deleteMany({});
        console.log(`   ✅ Deleted ${orderItemResult.deletedCount} order items`);
        
        const addressResult = await Address.deleteMany({ userId: { $in: [vendorId1, vendorId2, customerId] } });
        console.log(`   ✅ Deleted ${addressResult.deletedCount} addresses`);
        
        const shopResult = await Shop.deleteMany({ userId: { $in: [vendorId1, vendorId2] } });
        console.log(`   ✅ Deleted ${shopResult.deletedCount} shops`);
        
        const shopCategoryResult = await ShopCategory.deleteMany({});
        console.log(`   ✅ Deleted ${shopCategoryResult.deletedCount} shop categories`);
        
        const productCategoryResult = await ProductCategory.deleteMany({});
        console.log(`   ✅ Deleted ${productCategoryResult.deletedCount} product categories`);
        
        const productResult = await Product.deleteMany({});
        console.log(`   ✅ Deleted ${productResult.deletedCount} products`);

        const userResult = await User.deleteMany({ _id: { $in: [vendorId1, vendorId2, customerId] } });
        console.log(`   ✅ Deleted ${userResult.deletedCount} users`);

        console.log('\n🎉 All seeded data deleted successfully!');

    } catch (error) {
        console.error('❌ Error deleting data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

// Check command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'delete') {
    deleteSeededData();
} else if (command === 'seed') {
    seedDatabase();
} else {
    console.log('Usage:');
    console.log('  node seeder.js seed   - Seed the database with sample data');
    console.log('  node seeder.js delete - Delete all seeded data');
    console.log('\nDefaulting to seed operation...\n');
    seedDatabase();
}
