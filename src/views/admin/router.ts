
import RouteUsers from '@/views/admin/users/routes'
import RouteEventStatus from '@/views/admin/eventstatus/routes'
import RouteEventTypes from '@/views/admin/eventtypes/routes'
import RouteLocations from '@/views/admin/locations/routes'
import RoutePermissions from '@/views/admin/permissions/routes'
import RouteRoles from '@/views/admin/roles/routes'
import RouteFederations from '@/views/admin/federations/routes'
import RouteAssociations from '@/views/admin/associations/routes'
import RouteCountries from '@/views/admin/countries/routes'
import RouteCities from '@/views/admin/cities/routes'
import RouteNews from '@/views/admin/news/routes'
import RouteAthletes from '@/views/admin/athletes/routes'
import RouteSanctions from '@/views/admin/sanctions/routes'
import RouteEvents from '@/views/admin/events/routes'
import RouteRequests from '@/views/admin/requests/routes'
import RouteMinorAuthorizations from '@/views/admin/minorauthorization/routes'
import RouteMembershipTypes from '@/views/admin/membershiptypes/routes'
import RouteBelts from '@/views/admin/belts/routes'
import RoutePayments from '@/views/admin/payments/routes'
import RouteAssociationsUsers from '@/views/admin/associationsusers/routes'
import RouteFederationsUsers from '@/views/admin/federationsusers/routes'
import RouteReports from '@/views/admin/reports/routes'
import RouteAuditoria from '@/views/admin/auditoria/routes'

export default [
    ...RouteUsers,
    ...RouteEventStatus,
    ...RouteEventTypes,
    ...RouteEventTypes,
    ...RouteLocations,
    ...RoutePermissions,
    ...RouteRoles,
    ...RouteFederations,
    ...RouteAssociations,
    ...RouteCountries,
    ...RouteCities,
    ...RouteNews,
    ...RouteAthletes,
    ...RouteSanctions,
    ...RouteEvents,
    ...RouteRequests,
    ...RouteMinorAuthorizations,
    ...RouteMembershipTypes,
    ...RouteBelts,
    ...RoutePayments,
    ...RouteAssociationsUsers,
    ...RouteFederationsUsers,
    ...RouteReports,
    ...RouteAuditoria
]