export class CrimeDefs {

    public static VAT_PERCENTAGE = 0.15;
    public static WITH_VAT_BASIS = 1.15;
    public static PERV_VAT_PERCENTAGE = 0.175;
    public static PREV_WITH_VAT_BASIS = 1.175;
    public static VAT_CHANGE_DATE2008 = '14/12/2008'; // dd/MM/yyyy
    public static VAT_CHANGE_DATE2010 = '01/01/2010'; // dd/MM/yyyy
    public static VAT_CHANGE_DATE2011 = '03/01/2011'; // dd/MM/yyyy
    public static AGFS_RATEBASE_CHANGEDATE1 = '27/04/2010';
    public static AGFS_RATEBASE_CHANGEDATE2 = '01/04/2011';
    public static AGFS_RATEBASE_CHANGEDATE3 = '01/04/2012';

    public static INV_PSSCHEME_CHANGE2010 = '06/04/2010';
    // tsl:disable-next-line:max-line-length
    public static INV_PSSCHEME_CHANGE2016 = '01/04/2016'; // new addition janaka-scheme change after 11 jan 2016// @janaka // jp 26.11.2015
    public static PL_FIXED_FEES_JULY2010 = '14/07/2010';
    public static AGFS_SCHEME5 = '27/04/2010';
    public static AGFS_SCHEME6 = '01/01/2011';
    public static AGFS_SCHEME7 = '01/04/2011';
    public static AGFS_SCHEME8 = '03/10/2011';
    public static AGFS_SCHEME9 = '01/04/2012';

    public static OCTOBER2011_CHANGE = '03/10/2011';
    public static APRIL2016_CHANGE = '01/04/2016';

    // MPP 21.6.18 loads of new work for April 2018...
    public static APRIL2018_REFORMS = '01/04/2018';


    public static CHANGE_SUB_NOV2011 = '01/11/2011';
    public static AGFS_REDUCTION_CHANGE2012 = '01/04/1012';

    public static OCTOBER2014_CRACKED_TRL_CHANGE = '02/10/2014';

    public static VHCC_RATE_CHANGE2008 = '13/11/2008';
    // public static   VHCC_RATE_REPORDER = '14/01/2008';
    public static VHCC_RATE_REPORDER2010 = '14/07/2010';

    public static AGFS_ELECTION_OF_DEFS = 203.00;
    public static LGFS_ELECTION_OF_DEFS = 362.00;
    // public static   AGFS_ELECTION_OF_DEFS_REDUCED = 194.00M;

    public static CRIME_DECEMBER_2013_CHANGE = '02/12/2013';
    public static CRIME_APRIL_2014_CHANGE = '22/04/2014';

    public static FEE_CHANGE_MARCH2014 = '20/03/2014';
    public static PERCENTAGE_APPLIED_AFTER_MARCH2014 = '0.9125';

    public static FEE_CHANGE_JUNE2015 = '30/06/2015';
    public static PERCENTAGE_APPLIED_AFTER_JUNE2015 = '0.825';

    public static FEE_CHANGE_MARCH2016 = '31/03/2016';
    public static PERCENTAGE_APPLIED_AFTER_MARCH2016 = '0.9125';

    public static LSC_CHANGE_MARCH2015 = '23/03/2015';

    // 100406
    public static MILEAGE_RATE = 0.45;
    public static MILEAGE_RATE_PUBLIC  = 0.25;
    public static HALF_DAY_HRS = 210;
    public static FULL_DAY_HRS = 420;
    public static EARLY_COVER_AMT = 75;
    public static RMC_AMT = 25;

    // MPP 15.6.18 use , converted from
    public static AGFS_OCT2011_RATE = 0.89; //  11%  reduction to the current scheme

    public static MAXCLASSINFOPROPS = 50;
    public static MAXCLASSLISTLENGTH = 100;

    public static ALL_CLASSES = 0;
    public static CCOURTCLASSID = 1;
    public static ASSCLSWORKCLASSID = 2;
    public static INVESTIGATIONCLASSID = 3;
    public static PROCLASSID = 4;
    public static APPEALSCLASSID = 5;
    public static PRISONCLASSID = 6;
    public static PRISONOTHRECLASSID = 7;
    //  public static   CIVILCLASSID = 7;
    public static DEFSENTCLASSID = 9;
    public static INVPOSTCLASSID = 10;
    public static LGFSCLASSID = 100;
    public static AGFSCLASSID = 110;
    public static INVPRECLASSID = 130; // added by CYR on 28.04.2017 for Investigation Pre Charge Class
    public static VHCCCLASS = -10;
    public static COURTDUTY_FILEID = 0;
    public static COURTDUTY_SUBTYPE = 8;
    public static INV_NONFIXED = 8;

    public static MAX_AGFS_WORKTYPES = 150;

    public static MAX_AGFS_FIXEDTIME = 5000;
    public static MAX_AGFS_DIARYDISBS = 2000;
    public static MAX_AGFS_DISBS = 5000;
    public static MAX_AGFS_TRAVELTIME = 2000;
    public static MAX_CDS6_LINES = 5000;
    public static MAX_BULKLOAD_ELEMENTS = 27;
    public static MAX_LEADUFN_CLIENTS = 500;

    public static MAX_LGFS_TRIALTYPES = 50;

    public static MAXTIMETYPES = 10;
    public static CC_TEL_ERVIEW_RATE = 10.90;
    public static CDS_DIRECT_ACCEPT_FEE = 8.00;
    public static COMMITTAL_FEE = 318.00;
    // OV's
    public static REP_ORDER_DATE = 3570;
    public static REP_ORDER_NO = 3965;
    public static ADD_MAATREF1 = 3950;
    public static ADD_MAATREF2 = 3951;
    public static REP_ORDER_TRANS_DATE = 3952;
    public static PROSECUTING_AUTHORITY = 3966;
    public static ORDER_JUDICIAL_APP = 3967;
    public static CLIENT_SNAME = 496;
    public static CLIENT_FNAME = 807;
    public static CLIENT_DOB = 900;
    public static CLIENT_INITIALS = 497;
    public static ETHNIC_CODE = 3975;
    public static GENDER = 3976;
    public static DISABILITY = 3977;
    public static UFN = 3999;
    public static LEAD_UFN = 3990;
    public static DSCC_NO = 3978;
    public static VAR_CASE_TO_CC = 3991;
    public static VAR_EW_CASE = 3992;
    public static VAR_IND_DIRECT = 3993;
    public static VAR_SERIOUS_FRAUD = 3772;

    public static MAT_Start_Date = 1001; // added by CYR on 03.05.2017 for Investigation Pre Charge Class stageReached INVK Validation

    public static CC_TOTAL_CLAIM = 904;

    public static APPVAR_COMPANY_NAME = 1;

    public static AGFS_REDUCTION_TRIAL = 1;
    public static AGFS_REDUCTION_RETRIAL = 2;
    public static INV_FIXEDFEE_CATEGORY = 1;

    public static MAX_PPE_CAP = 10000;

    // SO Var
    public static FIRM_ACCOUNT_NUM = 10;
    public static VENDER_NAME = 1;


    public static VHCC_STANDARD_RATE_A = 55.75;
    public static VHCC_STANDARD_RATE_B = 47.25;
    public static VHCC_STANDARD_RATE_C = 34.00;

}
