workspace "Doctor Website with Admin" "Medical practice website with content management system"

    !identifiers hierarchical

    model {
        patient = person "Patient" "Individual seeking medical consultation and appointment booking"
        admin = person "Website Administrator" "Medical practice staff managing website content"
        
        doctorWebsite = softwareSystem "Doctor Website System" "Web application for medical practice with patient portal and admin panel" {
            
            // Frontend Layer
            angularApp = container "Angular Application" "Main frontend application built with Angular 17" "Angular 17, TypeScript, Bootstrap 5, FontAwesome"
            
            // Page Components
            homePage = container "Home Page" "Landing page with hero section, treatments, testimonials" "Angular Component"
            aboutPage = container "About Page" "Doctor information and practice details" "Angular Component"
            contactPage = container "Contact Page" "Contact information and location details" "Angular Component"
            adminPage = container "Admin Page" "Content management interface for website administrators" "Angular Component"
            
            // UI Components
            headerComponent = container "Header Component" "Navigation bar with doctor info and appointment booking" "Angular Component"
            heroComponent = container "Hero Component" "Main banner with doctor introduction and CTA" "Angular Component"
            treatmentsComponent = container "Treatments Component" "Displays available medical treatments and services" "Angular Component"
            testimonialsComponent = container "Testimonials Component" "Patient reviews and feedback display" "Angular Component"
            appointmentFormComponent = container "Appointment Form" "Modal form for booking appointments" "Angular Component, Reactive Forms"
            footerComponent = container "Footer Component" "Site footer with contact information" "Angular Component"
            blogsComponent = container "Blogs Component" "Medical blog posts and articles" "Angular Component"
            galleryComponent = container "Gallery Component" "Image gallery for practice photos" "Angular Component"
            
            // Service Layer
            dataService = container "Data Service" "Business logic and data access layer" "Angular Service, TypeScript"
            storageService = container "Storage Service" "Client-side data persistence and state management" "Angular Service, RxJS, localStorage"
            
            // Data Models
            doctorInfoModel = container "Doctor Info Model" "Doctor profile and practice information" "TypeScript Interface"
            treatmentModel = container "Treatment Model" "Medical treatment and service definitions" "TypeScript Interface"
            testimonialModel = container "Testimonial Model" "Patient review and rating structure" "TypeScript Interface"
            contactInfoModel = container "Contact Info Model" "Contact details and location data" "TypeScript Interface"
            blogModel = container "Blog Model" "Blog post structure and metadata" "TypeScript Interface"
            statModel = container "Stat Model" "Practice statistics and metrics" "TypeScript Interface"
            
            // Routing
            router = container "Angular Router" "Client-side routing and navigation" "Angular Router"
            
            // External Dependencies
            browserStorage = container "Browser LocalStorage" "Client-side data persistence" "Web API"
            bootstrapJS = container "Bootstrap JavaScript" "Modal and UI component functionality" "Bootstrap 5"
            
            // Component Relationships
            angularApp -> router "Uses for navigation"
            angularApp -> dataService "Uses for business logic"
            angularApp -> storageService "Uses for data persistence"
            
            // Page to Component Relationships
            homePage -> headerComponent "Includes"
            homePage -> heroComponent "Includes"
            homePage -> treatmentsComponent "Includes"
            homePage -> testimonialsComponent "Includes"
            homePage -> footerComponent "Includes"
            homePage -> appointmentFormComponent "Includes"
            
            aboutPage -> headerComponent "Includes"
            aboutPage -> footerComponent "Includes"
            aboutPage -> appointmentFormComponent "Includes"
            
            contactPage -> headerComponent "Includes"
            contactPage -> footerComponent "Includes"
            contactPage -> appointmentFormComponent "Includes"
            
            adminPage -> headerComponent "Includes"
            adminPage -> footerComponent "Includes"
            
            // Component to Service Relationships
            headerComponent -> dataService "Fetches doctor info"
            heroComponent -> dataService "Fetches doctor and contact info"
            treatmentsComponent -> dataService "Fetches treatments"
            testimonialsComponent -> dataService "Fetches testimonials"
            appointmentFormComponent -> dataService "Validates form data"
            footerComponent -> dataService "Fetches contact info"
            aboutPage -> dataService "Fetches doctor info"
            contactPage -> dataService "Fetches contact and doctor info"
            adminPage -> dataService "Manages all website data"
            
            // Service Layer Relationships
            dataService -> storageService "Manages data through"
            storageService -> doctorInfoModel "Stores and retrieves"
            storageService -> treatmentModel "Stores and retrieves"
            storageService -> testimonialModel "Stores and retrieves"
            storageService -> contactInfoModel "Stores and retrieves"
            storageService -> blogModel "Stores and retrieves"
            storageService -> statModel "Stores and retrieves"
            
            // External Dependencies
            storageService -> browserStorage "Persists data to"
            appointmentFormComponent -> bootstrapJS "Uses for modal functionality"
            headerComponent -> bootstrapJS "Uses for modal functionality"
            heroComponent -> bootstrapJS "Uses for modal functionality"
            aboutPage -> bootstrapJS "Uses for modal functionality"
            contactPage -> bootstrapJS "Uses for modal functionality"
        }
        
        browser = softwareSystem "Web Browser" "Client-side environment for running the web application"
        
        // External Relationships
        patient -> browser "Uses"
        admin -> browser "Uses"
        browser -> doctorWebsite.angularApp "Loads and interacts with"
        
        // User Interactions
        patient -> doctorWebsite "Views doctor information, books appointments, reads blogs"
        admin -> doctorWebsite "Manages content, updates doctor info, handles testimonials"
    }

    views {
    systemContext doctorWebsite "SystemContext" {
        include *
        autolayout lr
    }

    container doctorWebsite "ContainerDiagram" {
        include *
        autolayout tb
    }

    styles {
    element "Person" {
        shape person
        background #FFE0B2
        stroke #BF360C
        color #111111
        strokeWidth 2
    }

    element "Software System" {
        shape roundedbox
        background #BBDEFB
        stroke #0D47A1
        color #111111
        strokeWidth 3
    }

    element "Container" {
        shape roundedbox
        background #C8E6C9
        stroke #1B5E20
        color #111111
        strokeWidth 2
    }

    element "Boundary" {
        background #FAFAFA
        stroke #9E9E9E
        strokeWidth 2
    }

    relationship "Relationship" {
        thickness 2
        color #424242
    }
}

}

}