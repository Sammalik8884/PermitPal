namespace PermitPal.Domain.Enums;

public enum SubscriptionPlan { Solo, Host, Operator, Manager }
public enum SubscriptionStatus { Trialing, Active, PastDue, Cancelled }
public enum UserRole { Owner, Admin, Viewer }
public enum StrLegalStatus { Legal, Restricted, Banned, Varies }
public enum JurisdictionType { City, County, District, Borough, Commune, Shire, Lga, National }
public enum EnforcementLevel { Low, Medium, High, VeryHigh }
public enum RegulatoryChangeType { PermitFee, NightCap, NewPermit, PermitRemoved, TotRate, Zoning, Enforcement, Other }
public enum AlertSeverity { Info, Warning, Critical }
public enum PropertyType { EntireHome, PrivateRoom, SharedRoom, Apartment, House, Villa, Cabin, Other }
public enum HostedType { Hosted, Unhosted }
public enum ComplianceStatus { Compliant, Warning, NonCompliant, Unknown }
public enum PermitStatus { Active, Expired, Pending, Cancelled, NotRequired }
public enum BookingSource { Airbnb, Vrbo, Booking, Direct, Manual, Other }
public enum SyncStatus { Success, Failed, Pending }
public enum DocumentType { Permit, Registration, Insurance, FireCert, SafetyInspection, TaxCert, Other }
public enum AlertType { PermitExpiry, NightCap, RegulatoryChange, EuRegistration, LevyDue, All }
public enum NotificationChannel { Email, Sms, Push }
public enum NotificationStatus { Queued, Sent, Delivered, Failed }
public enum EuRegistrationStatus { NotStarted, InProgress, Submitted, Active, Invalid, Expired }
public enum LevyStatus { Calculating, Ready, Lodged, Overdue }
public enum ComplaintSource { Neighbour, Council, Platform, Other }
public enum ComplaintStatus { Open, Responded, Resolved, Escalated }
public enum UsTaxType { Tot, SalesTax, CountyOccupancy, CityTax, Other }
public enum TaxFilingStatus { Pending, Filed, Overdue }
