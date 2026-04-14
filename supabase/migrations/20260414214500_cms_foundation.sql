-- KGC CMS foundation for a fresh Supabase project.
-- Run this once in Supabase SQL Editor before pointing Vercel to the new project.
-- After this migration runs, create your first Auth user in Supabase, then run:
-- insert into public.user_roles (user_id, role)
-- values ('PASTE_AUTH_USER_ID_HERE', 'admin')
-- on conflict (user_id, role) do nothing;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'app_role'
  ) then
    create type public.app_role as enum ('admin', 'user');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short text not null,
  detail text not null,
  category text not null,
  icon_name text not null default 'Network',
  benefits text[] not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (title)
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text not null,
  highlights text[] not null default '{}',
  team_size text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (year)
);

create table if not exists public.career_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'Full-time',
  location text not null default 'Remote',
  description text not null,
  tab text not null default 'careers' check (tab in ('careers', 'internships')),
  requirements text[] not null default '{}',
  apply_url text,
  closing_date date,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  label text not null,
  description text,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  section_type text not null default 'content',
  title text,
  eyebrow text,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

create table if not exists public.seo_pages (
  slug text primary key,
  title text not null,
  description text not null default '',
  og_title text,
  og_description text,
  og_image_path text,
  canonical_path text,
  no_index boolean not null default false,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  location text not null check (location in ('header', 'footer')),
  label text not null,
  href text not null,
  is_external boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location, label)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'site-media',
  path text not null,
  alt_text text,
  caption text,
  mime_type text,
  width integer,
  height integer,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_milestones_updated_at on public.milestones;
create trigger set_milestones_updated_at
before update on public.milestones
for each row execute function public.set_updated_at();

drop trigger if exists set_career_openings_updated_at on public.career_openings;
create trigger set_career_openings_updated_at
before update on public.career_openings
for each row execute function public.set_updated_at();

drop trigger if exists set_site_content_updated_at on public.site_content;
create trigger set_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

drop trigger if exists set_page_sections_updated_at on public.page_sections;
create trigger set_page_sections_updated_at
before update on public.page_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_seo_pages_updated_at on public.seo_pages;
create trigger set_seo_pages_updated_at
before update on public.seo_pages
for each row execute function public.set_updated_at();

drop trigger if exists set_navigation_items_updated_at on public.navigation_items;
create trigger set_navigation_items_updated_at
before update on public.navigation_items
for each row execute function public.set_updated_at();

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

alter table public.user_roles enable row level security;
alter table public.services enable row level security;
alter table public.milestones enable row level security;
alter table public.career_openings enable row level security;
alter table public.site_content enable row level security;
alter table public.page_sections enable row level security;
alter table public.seo_pages enable row level security;
alter table public.navigation_items enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "Users can read own role" on public.user_roles;
create policy "Users can read own role"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can manage roles" on public.user_roles;
create policy "Admins can manage roles"
on public.user_roles
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services"
on public.services
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read active milestones" on public.milestones;
create policy "Public can read active milestones"
on public.milestones
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage milestones" on public.milestones;
create policy "Admins can manage milestones"
on public.milestones
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read active career openings" on public.career_openings;
create policy "Public can read active career openings"
on public.career_openings
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage career openings" on public.career_openings;
create policy "Admins can manage career openings"
on public.career_openings
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read published site content" on public.site_content;
create policy "Public can read published site content"
on public.site_content
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content"
on public.site_content
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read published page sections" on public.page_sections;
create policy "Public can read published page sections"
on public.page_sections
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage page sections" on public.page_sections;
create policy "Admins can manage page sections"
on public.page_sections
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read published seo pages" on public.seo_pages;
create policy "Public can read published seo pages"
on public.seo_pages
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage seo pages" on public.seo_pages;
create policy "Admins can manage seo pages"
on public.seo_pages
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read active navigation items" on public.navigation_items;
create policy "Public can read active navigation items"
on public.navigation_items
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage navigation items" on public.navigation_items;
create policy "Admins can manage navigation items"
on public.navigation_items
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can read media assets" on public.media_assets;
create policy "Public can read media assets"
on public.media_assets
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage media assets" on public.media_assets;
create policy "Admins can manage media assets"
on public.media_assets
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site media" on storage.objects;
create policy "Public can read site media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-media');

drop policy if exists "Admins can insert site media" on storage.objects;
create policy "Admins can insert site media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));

grant usage on schema public to anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;
grant select on public.services to anon, authenticated;
grant select on public.milestones to anon, authenticated;
grant select on public.career_openings to anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant select on public.page_sections to anon, authenticated;
grant select on public.seo_pages to anon, authenticated;
grant select on public.navigation_items to anon, authenticated;
grant select on public.media_assets to anon, authenticated;
grant select on public.user_roles to authenticated;
grant insert, update, delete on public.user_roles to authenticated;
grant insert, update, delete on public.services to authenticated;
grant insert, update, delete on public.milestones to authenticated;
grant insert, update, delete on public.career_openings to authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant insert, update, delete on public.page_sections to authenticated;
grant insert, update, delete on public.seo_pages to authenticated;
grant insert, update, delete on public.navigation_items to authenticated;
grant insert, update, delete on public.media_assets to authenticated;

insert into public.services (title, short, detail, category, icon_name, benefits, sort_order)
values
  (
    'Supply Chain Network Design',
    'How many production or distribution facilities is the right fit for my business purpose?',
    'We combine sound business knowledge with our linear modelling based approach to redefine parts or the whole end-to-end supply chain network.',
    'Supply Chain',
    'Network',
    array['End-to-end network optimization', 'Linear modelling-based approach', 'Facility location analysis', 'Cost-to-serve optimization', 'Scenario planning and simulation'],
    0
  ),
  (
    'Warehousing and Transportation',
    'Want to give a boost to your logistics operations?',
    'Optimizing warehouse layouts, transportation routes and logistics costs to drive efficiency across your operations.',
    'Supply Chain',
    'Warehouse',
    array['Warehouse layout optimization', 'Transportation route planning', 'Logistics cost reduction', 'Process standardization', 'Performance KPI dashboards'],
    1
  ),
  (
    'Inventory and Demand Management',
    'Strike the right balance between service and working capital.',
    'Advanced forecasting and inventory optimization to ensure the right products are available at the right time and place.',
    'Supply Chain',
    'PackageSearch',
    array['Demand forecasting models', 'Safety stock optimization', 'Service level management', 'Working capital improvement', 'Seasonal planning strategies'],
    2
  ),
  (
    'Cost to Serve',
    'Gain visibility of different customer segments and true cost of serving them.',
    'We can help you unveil the true cost of serving your customers and apply the right segmentation policies to maximize profit.',
    'Supply Chain',
    'DollarSign',
    array['Customer segmentation analysis', 'Profitability modelling', 'Channel cost analysis', 'Pricing strategy support', 'Margin optimization'],
    3
  ),
  (
    'Project Planning and Execution',
    'Enhance team synergy and project transparency.',
    'From resource allocation to stakeholder communication, we guide you through every stage of the project lifecycle.',
    'Project Management',
    'ClipboardCheck',
    array['Resource allocation planning', 'Stakeholder management', 'Risk assessment frameworks', 'Milestone tracking and reporting', 'Change management support'],
    4
  ),
  (
    'Risk Assessment and Mitigation',
    'Concerned about potential roadblocks? Let''s tackle them head-on.',
    'Identifying, evaluating and mitigating risks to keep your projects and operations on track.',
    'Project Management',
    'ShieldAlert',
    array['Risk identification workshops', 'Probability and impact assessment', 'Mitigation strategy design', 'Contingency planning', 'Continuous monitoring frameworks'],
    5
  ),
  (
    'Marketing Strategy Development',
    'Discover how to maximize your market presence.',
    'Crafting cohesive strategies that resonate with your target audience, leverage the right channels, and maximize your ROI.',
    'Digital Marketing',
    'Megaphone',
    array['Market analysis and positioning', 'Channel strategy and mix', 'Campaign planning and ROI', 'Digital presence audit', 'Competitive benchmarking'],
    6
  ),
  (
    'Brand Positioning and Identity',
    'Solidify your brand identity and message.',
    'Building a distinctive brand that stands out in the market and connects authentically with your customers.',
    'Digital Marketing',
    'Palette',
    array['Brand audit and assessment', 'Visual identity guidelines', 'Messaging framework', 'Brand architecture', 'Customer perception analysis'],
    7
  )
on conflict (title) do update
set short = excluded.short,
    detail = excluded.detail,
    category = excluded.category,
    icon_name = excluded.icon_name,
    benefits = excluded.benefits,
    sort_order = excluded.sort_order,
    is_active = true;

insert into public.milestones (year, title, description, highlights, team_size, sort_order)
values
  ('2024', 'Scaling Operations', 'Strengthened partnerships and deepened expertise in data-driven consulting.', array['15 team members', 'Expanded client base across 15+ countries', 'Focus on supply chain network design'], '15 team members', 0),
  ('2023', 'Growing Impact', 'Expanded international reach with a growing portfolio of complex engagements.', array['12 team members', 'Projects in 15+ countries', 'Supply chain network design focus'], '12 team members', 1),
  ('2022', 'Internship Programme', 'Launched a structured internship programme for emerging talent in Montenegro.', array['9 team members', 'First intern cohort', 'Talent pipeline established'], '9 team members', 2),
  ('2021', 'Industry Recognition', 'Delivered projects across automotive, pharma, retail and consumer goods sectors.', array['7 team members', 'Multi-sector delivery', 'European partner network'], '7 team members', 3),
  ('2020', 'Remote-First Pivot', 'Successfully transitioned to remote consulting, expanding our global client base.', array['5 team members', 'Remote-first operations', 'Global client expansion'], '5 team members', 4),
  ('2019', 'Expanding Expertise', 'Added digital marketing and project management to our service portfolio.', array['4 team members', 'New service lines', 'Broader consulting scope'], '4 team members', 5),
  ('2018', 'First International Projects', 'Partnered with leading European consulting firms on supply chain engagements.', array['2 team members', 'European partnerships', 'Supply chain focus'], '2 team members', 6),
  ('2017', 'Founded', 'KGC established in Tivat, Montenegro as a management consulting firm.', array['1 founder', 'Tivat, Montenegro', 'Vision set in motion'], '1 founder', 7)
on conflict (year) do update
set title = excluded.title,
    description = excluded.description,
    highlights = excluded.highlights,
    team_size = excluded.team_size,
    sort_order = excluded.sort_order,
    is_active = true;

insert into public.navigation_items (location, label, href, is_external, sort_order)
values
  ('header', 'About', '#about', false, 0),
  ('header', 'Expertise', '#expertise', false, 1),
  ('header', 'Milestones', '#milestones', false, 2),
  ('header', 'Careers', '/careers', false, 3),
  ('header', 'Contact', '/contact', false, 4),
  ('footer', 'About', '#about', false, 0),
  ('footer', 'Expertise', '#expertise', false, 1),
  ('footer', 'Milestones', '#milestones', false, 2),
  ('footer', 'Careers', '/careers', false, 3),
  ('footer', 'Contact', '/contact', false, 4)
on conflict (location, label) do update
set href = excluded.href,
    is_external = excluded.is_external,
    sort_order = excluded.sort_order,
    is_active = true;

insert into public.site_content (key, label, description, content)
values
  (
    'company.contact',
    'Company contact details',
    'Shared email, office address, and social links used across the site.',
    jsonb_build_object(
      'email', 'info@kgc.co.me',
      'officeName', 'Arsenal Business Club',
      'street', 'Seljanovo B.B.',
      'city', 'Tivat',
      'country', 'Montenegro',
      'linkedinUrl', 'https://www.linkedin.com/in/velibor-kastratovic/'
    )
  ),
  (
    'home.hero',
    'Home hero',
    'Main homepage headline, intro, CTAs, and stats.',
    jsonb_build_object(
      'headline', 'Execution-Ready Supply Chain and Growth Consulting',
      'intro', 'From Montenegro, KGC helps teams across Europe optimize operations, sharpen digital strategy, and deliver complex work with measurable momentum.',
      'primaryCtaLabel', 'Our Expertise',
      'primaryCtaHref', '#expertise',
      'secondaryCtaLabel', 'Get in Touch',
      'secondaryCtaHref', '/contact',
      'stats', jsonb_build_array(
        jsonb_build_object('value', '7+', 'label', 'Years of Excellence'),
        jsonb_build_object('value', '15+', 'label', 'Countries Served'),
        jsonb_build_object('value', '50+', 'label', 'Projects Delivered')
      )
    )
  ),
  (
    'home.about',
    'Home about',
    'Homepage company introduction and value pillars.',
    jsonb_build_object(
      'headline', 'Management Consulting from Montenegro to the World',
      'body', jsonb_build_array(
        'KGC d.o.o. is a management consulting firm headquartered in Tivat, Montenegro. We specialize in supply chain consulting, digital marketing strategy, and project management, helping businesses across Europe and beyond optimize their operations and accelerate growth.',
        'Our team combines deep industry expertise with a hands-on, collaborative approach. We do not just advise; we embed ourselves in your challenges to deliver measurable, lasting results.'
      ),
      'pillars', jsonb_build_array(
        jsonb_build_object('title', 'Precision', 'description', 'Data-driven strategies tailored to your unique challenges and market position.', 'iconName', 'Target'),
        jsonb_build_object('title', 'Innovation', 'description', 'Blending proven methodologies with fresh thinking to unlock new opportunities.', 'iconName', 'Lightbulb'),
        jsonb_build_object('title', 'Impact', 'description', 'Measurable results that drive sustainable growth and operational excellence.', 'iconName', 'TrendingUp'),
        jsonb_build_object('title', 'Partnership', 'description', 'Collaborative engagement with your teams, not work done in isolation.', 'iconName', 'Users')
      )
    )
  ),
  (
    'home.expertise',
    'Home expertise intro',
    'Heading and intro above service cards.',
    jsonb_build_object(
      'headline', 'What We Deliver',
      'intro', 'Practical support across supply chain, project management, and digital marketing, shaped around the outcomes your team needs to deliver.'
    )
  ),
  (
    'home.contact_cta',
    'Home contact CTA',
    'Homepage contact call to action.',
    jsonb_build_object(
      'eyebrow', 'Contact',
      'headline', 'Ready to Discuss a Project?',
      'intro', 'Share the challenge, timeline, and outcome you are aiming for. We will help you find the right next step.',
      'buttonLabel', 'Start a Conversation',
      'buttonHref', '/contact'
    )
  ),
  (
    'careers.page',
    'Careers page copy',
    'Careers and internship page intro copy.',
    jsonb_build_object(
      'headline', 'Join Our Team',
      'intro', 'Build your career in management consulting with a team that values impact, growth, and collaboration.',
      'careersHeading', 'Why KGC?',
      'positionsHeading', 'Open Positions',
      'noOpeningsTitle', 'No active openings right now',
      'noOpeningsBody', 'We still review strong profiles in supply chain, project management, digital marketing, data analytics, and business strategy. Send your CV and a short note so we can keep you in mind for the right future role.',
      'talentPoolTitle', 'Don''t see the right role?',
      'talentPoolBody', 'We''re always looking for exceptional talent. Send us your CV and we''ll keep you in mind for future openings.',
      'talentPoolButtonLabel', 'Send Your CV',
      'internshipHeading', 'KGC Internship Programme',
      'internshipIntro', jsonb_build_array(
        'Our structured internship programme offers ambitious graduates the opportunity to gain real-world consulting experience alongside seasoned professionals.',
        'Interns at KGC work on live client projects, participate in training sessions, and receive dedicated mentorship. It''s not an observation role; you''ll be an active contributor from day one.'
      ),
      'preferredFieldsHeading', 'Preferred Fields',
      'preferredFields', jsonb_build_array('Supply Chain & Logistics', 'Digital Marketing', 'Project Management', 'Data Analytics', 'Business Strategy'),
      'careerPerks', jsonb_build_array(
        jsonb_build_object('iconName', 'Rocket', 'title', 'Challenging Projects', 'description', 'Work on complex consulting engagements with Fortune 500 and mid-market clients across multiple industries.'),
        jsonb_build_object('iconName', 'Globe', 'title', 'International Exposure', 'description', 'Collaborate with teams and clients across 15+ countries, gaining invaluable cross-cultural experience.'),
        jsonb_build_object('iconName', 'Briefcase', 'title', 'Career Growth', 'description', 'Clear progression paths with mentorship from senior consultants who have decades of global experience.'),
        jsonb_build_object('iconName', 'Coffee', 'title', 'Flexible Environment', 'description', 'Remote-first culture that values output and impact over hours spent at a desk.')
      ),
      'internPerks', jsonb_build_array(
        jsonb_build_object('iconName', 'Rocket', 'title', 'Real Projects', 'description', 'Work on live consulting engagements, not busy work. Your contributions will have real impact.'),
        jsonb_build_object('iconName', 'GraduationCap', 'title', 'Structured Mentorship', 'description', 'Learn directly from experienced consultants with dedicated 1:1 mentoring sessions.'),
        jsonb_build_object('iconName', 'Globe', 'title', 'Global Perspective', 'description', 'Gain exposure to international business practices and cross-border consulting.'),
        jsonb_build_object('iconName', 'Coffee', 'title', 'Flexible & Remote', 'description', 'Work remotely with flexible hours, designed to fit alongside your studies or other commitments.')
      )
    )
  ),
  (
    'contact.page',
    'Contact page copy',
    'Contact page heading and helper copy.',
    jsonb_build_object(
      'headline', 'Let''s Start a Conversation',
      'intro', 'Reach out to discuss how KGC can help transform your business operations.',
      'formHelper', 'This form opens a prepared email draft so you can review it before sending.',
      'successTitle', 'Email Draft Opened',
      'successBody', 'Your message is ready in your email app. Please review and send it from there.'
    )
  )
on conflict (key) do update
set label = excluded.label,
    description = excluded.description,
    content = excluded.content,
    is_published = true;

insert into public.seo_pages (slug, title, description, og_title, og_description, canonical_path)
values
  ('home', 'KGC - Management Consulting from Montenegro', 'Execution-ready supply chain, project management, and digital marketing consulting from Montenegro.', 'KGC - Management Consulting from Montenegro', 'Practical consulting support for operations, growth, and complex project delivery.', '/'),
  ('careers', 'Careers at KGC', 'Build your career in management consulting with KGC.', 'Careers at KGC', 'Explore career and internship opportunities with KGC.', '/careers'),
  ('contact', 'Contact KGC', 'Start a conversation with KGC about your project, operations, or growth challenge.', 'Contact KGC', 'Share your challenge and find the right next step with KGC.', '/contact')
on conflict (slug) do update
set title = excluded.title,
    description = excluded.description,
    og_title = excluded.og_title,
    og_description = excluded.og_description,
    canonical_path = excluded.canonical_path,
    is_published = true;
