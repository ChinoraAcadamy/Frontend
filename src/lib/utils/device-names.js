/**
 * Maps technical device model codes to human-friendly names.
 * Especially useful for Samsung, Xiaomi, and other devices which return codes.
 */

const samsungModels = {
    // S24 Series
    'SM-S928': 'Samsung Galaxy S24 Ultra',
    'SM-S926': 'Samsung Galaxy S24+',
    'SM-S921': 'Samsung Galaxy S24',
    // S23 Series
    'SM-S918': 'Samsung Galaxy S23 Ultra',
    'SM-S916': 'Samsung Galaxy S23+',
    'SM-S911': 'Samsung Galaxy S23',
    // S22 Series
    'SM-S908': 'Samsung Galaxy S22 Ultra',
    'SM-S906': 'Samsung Galaxy S22+',
    'SM-S901': 'Samsung Galaxy S22',
    // S21 Series
    'SM-G998': 'Samsung Galaxy S21 Ultra',
    'SM-G996': 'Samsung Galaxy S21+',
    'SM-G991': 'Samsung Galaxy S21',
    'SM-G990': 'Samsung Galaxy S21 FE',
    // S20 Series
    'SM-G988': 'Samsung Galaxy S20 Ultra',
    'SM-G986': 'Samsung Galaxy S20+',
    'SM-G981': 'Samsung Galaxy S20',
    'SM-G980': 'Samsung Galaxy S20',
    'SM-G780': 'Samsung Galaxy S20 FE',
    'SM-G781': 'Samsung Galaxy S20 FE',
    // S10 Series
    'SM-G975': 'Samsung Galaxy S10+',
    'SM-G973': 'Samsung Galaxy S10',
    'SM-G970': 'Samsung Galaxy S10e',
    // Note Series
    'SM-N986': 'Samsung Galaxy Note 20 Ultra',
    'SM-N981': 'Samsung Galaxy Note 20',
    'SM-N975': 'Samsung Galaxy Note 10+',
    'SM-N970': 'Samsung Galaxy Note 10',
    // Z Fold/Flip
    'SM-F946': 'Samsung Galaxy Z Fold 5',
    'SM-F731': 'Samsung Galaxy Z Flip 5',
    'SM-F936': 'Samsung Galaxy Z Fold 4',
    'SM-F721': 'Samsung Galaxy Z Flip 4',
    'SM-F926': 'Samsung Galaxy Z Fold 3',
    'SM-F711': 'Samsung Galaxy Z Flip 3',
    // A Series (Common)
    'SM-A546': 'Samsung Galaxy A54 5G',
    'SM-A536': 'Samsung Galaxy A53 5G',
    'SM-A525': 'Samsung Galaxy A52',
    'SM-A528': 'Samsung Galaxy A52s 5G',
    'SM-A346': 'Samsung Galaxy A34 5G',
    'SM-A336': 'Samsung Galaxy A33 5G',
    'SM-A736': 'Samsung Galaxy A73 5G',
    'SM-A146': 'Samsung Galaxy A14 5G',
    'SM-A145': 'Samsung Galaxy A14',
    'SM-A245': 'Samsung Galaxy A24',
    'SM-A045': 'Samsung Galaxy A04',
    'SM-A047': 'Samsung Galaxy A04s',
    'SM-A035': 'Samsung Galaxy A03',
    'SM-A037': 'Samsung Galaxy A03s'
};

const appleModels = {
    'iPhone16,1': 'iPhone 15 Pro',
    'iPhone16,2': 'iPhone 15 Pro Max',
    'iPhone15,4': 'iPhone 15',
    'iPhone15,5': 'iPhone 15 Plus',
    'iPhone15,2': 'iPhone 14 Pro',
    'iPhone15,3': 'iPhone 14 Pro Max',
    'iPhone14,7': 'iPhone 14',
    'iPhone14,8': 'iPhone 14 Plus',
    'iPhone14,2': 'iPhone 13 Pro',
    'iPhone14,3': 'iPhone 13 Pro Max',
    'iPhone14,4': 'iPhone 13 mini',
    'iPhone14,5': 'iPhone 13',
    'iPhone13,1': 'iPhone 12 mini',
    'iPhone13,2': 'iPhone 12',
    'iPhone13,3': 'iPhone 12 Pro',
    'iPhone13,4': 'iPhone 12 Pro Max',
    'iPhone12,1': 'iPhone 11',
    'iPhone12,3': 'iPhone 11 Pro',
    'iPhone12,5': 'iPhone 11 Pro Max',
    'iPhone12,8': 'iPhone SE (2nd Gen)',
    'iPhone14,6': 'iPhone SE (3rd Gen)'
};

const xiaomiModels = {
    '23127PN0CG': 'Xiaomi 14',
    '23116PN5BC': 'Xiaomi 14 Pro',
    '2304FPN6DG': 'Xiaomi 13 Ultra',
    '2211133G': 'Xiaomi 13',
    '2210132G': 'Xiaomi 13 Pro',
    '2203121C': 'Xiaomi 12 Pro',
    '2201123G': 'Xiaomi 12',
    'M2101K6G': 'Redmi Note 10 Pro',
    'M2101K7AG': 'Redmi Note 10',
    'M2007J20CG': 'POCO X3 NFC',
    'M2012K11AG': 'POCO F3',
    '2201116SG': 'Redmi Note 11 Pro',
    '2201117TY': 'Redmi Note 11',
    '22101316G': 'Redmi Note 12',
    '23090RA98G': 'Redmi Note 13 Pro',
    '2312DRA50G': 'Redmi Note 13'
};

const huaweiModels = {
    'ANA-LX4': 'Huawei P40',
    'ELS-NX9': 'Huawei P40 Pro',
    'VOG-L29': 'Huawei P30 Pro',
    'ELE-L29': 'Huawei P30',
    'CLT-L29': 'Huawei P20 Pro',
    'EML-L29': 'Huawei P20'
};

/**
 * Returns a friendly name for a device model code.
 * @param {string} modelCode - The model code (e.g. "SM-S908N")
 * @param {string} [vendor] - Optional vendor name from server-side detection
 * @returns {string} - Friendly name or original code if not found
 */
export function getFriendlyDeviceName(modelCode, vendor = '') {
    if (!modelCode) return '';

    // If it's already a friendly name (contains spaces and starts with a capital letter)
    // we might want to return it as is, unless it's a known model code.
    
    // Guess vendor from prefix if not provided
    if (!vendor) {
        if (modelCode.startsWith('SM-') || modelCode.startsWith('GT-')) vendor = 'Samsung';
        else if (modelCode.startsWith('iPhone')) vendor = 'Apple';
        else if (modelCode.startsWith('M2') || modelCode.startsWith('2') || modelCode.startsWith('REDMI') || modelCode.startsWith('POCO')) vendor = 'Xiaomi';
        else if (modelCode.startsWith('CPH') || modelCode.startsWith('PHT')) vendor = 'Oppo';
        else if (modelCode.startsWith('V2')) vendor = 'Vivo';
        else if (modelCode.startsWith('RMX')) vendor = 'Realme';
        else if (modelCode.startsWith('KB2') || modelCode.startsWith('LE2') || modelCode.startsWith('NE2')) vendor = 'OnePlus';
    }

    // Check Samsung
    if (vendor === 'Samsung') {
        for (const [code, name] of Object.entries(samsungModels)) {
            if (modelCode.startsWith(code)) {
                return name;
            }
        }
    }

    // Check Apple
    if (vendor === 'Apple') {
        if (appleModels[modelCode]) return appleModels[modelCode];
    }

    // Check Xiaomi/Redmi
    if (vendor === 'Xiaomi') {
        if (xiaomiModels[modelCode]) return xiaomiModels[modelCode];
    }

    // Check Huawei
    if (vendor === 'Huawei') {
        if (huaweiModels[modelCode]) return huaweiModels[modelCode];
    }

    // If no specific mapping found, but we have a vendor, return "Vendor ModelCode"
    if (vendor && vendor !== 'Unknown' && !modelCode.toLowerCase().includes(vendor.toLowerCase())) {
        // Special case for Apple: if vendor is Apple but model is just "iPhone", it's generic
        if (vendor === 'Apple' && modelCode === 'iPhone') return 'iPhone';
        return `${vendor} ${modelCode}`;
    }

    return modelCode;
}
