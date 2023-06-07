from dataclasses import dataclass
from typing import Optional



@dataclass
class IntegrationjobDefinition:
    unit: str
    count: int
    level: str
    startDate: Optional[str] = None

@dataclass
class IntegrationArgs:
    integrationId: str
    providerAccountId: str
    currency: str
    timezone: str
    jobDefinition: IntegrationjobDefinition
    credentialId: str
    assetType: str
    providerAccountName: Optional[str] = None
    schedule: Optional[str] = None
    customArgs: Optional[dict] = None




# TODO: change it later to match the new format.
# TODO: move it to the shared types.