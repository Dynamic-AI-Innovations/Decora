-- Decora seed data.
-- Plans (founding + standard B2C). Prices in Naira, monthly + annual.

insert into public.plan (id, monthly_render_limit, watermark, founding, price_ngn_monthly, price_ngn_annual)
values
    ('free',      2,    true,  false, 0,        0),
    ('home',      40,   false, false, 15000,    153000),
    ('family',    120,  false, false, 35000,    357000),
    ('elite',     -1,   false, false, 75000,    765000),  -- -1 sentinel for unlimited
    ('signature', -1,   false, false, 120000,   1224000),
    -- founding-locked variants (locked until October 2027 for first 1,000 paying users)
    ('home_founding',      40,  false, true, 8000,  81600),
    ('family_founding',    120, false, true, 18500, 188700),
    ('elite_founding',     -1,  false, true, 40000, 408000),
    ('signature_founding', -1,  false, true, 65000, 663000)
on conflict (id) do nothing;

-- Seed a starter price catalogue (mock V1 — replace with manual market research
-- before launch). Source = manual, updated monthly per BUILD.md §3.4 Layer 1.
insert into public.price_catalogue
    (category, subcategory, item_name, tier, price_min_ngn, price_mid_ngn, price_max_ngn, source)
values
    ('sofa_3seater', null, '3-seater fabric sofa', 'entry',   80000,  130000, 180000, 'manual'),
    ('sofa_3seater', null, '3-seater fabric sofa', 'mid',     200000, 280000, 380000, 'manual'),
    ('sofa_3seater', null, '3-seater leather sofa', 'premium', 600000, 850000, 1500000, 'manual'),

    ('floor_tile_sqm', null, 'Ceramic floor tile (per sqm)', 'entry',   2500, 3500, 5000, 'manual'),
    ('floor_tile_sqm', null, 'Porcelain tile (per sqm)',    'mid',     6500, 8500, 12000, 'manual'),
    ('floor_tile_sqm', null, 'Italian porcelain (per sqm)', 'premium', 16000, 22000, 35000, 'manual'),

    ('ceiling_light', null, 'Basic ceiling light',   'entry',   3500,  5000,  8500, 'manual'),
    ('ceiling_light', null, 'Pendant light',         'mid',     12000, 18000, 28000, 'manual'),
    ('ceiling_light', null, 'Designer chandelier',   'premium', 55000, 75000, 180000, 'manual'),

    ('bedroom_wardrobe', null, '3-door wardrobe',  'entry',   90000,  120000, 180000, 'manual'),
    ('bedroom_wardrobe', null, 'Walk-in wardrobe', 'mid',     280000, 380000, 520000, 'manual'),
    ('bedroom_wardrobe', null, 'Bespoke wardrobe', 'premium', 700000, 950000, 1800000, 'manual'),

    ('wall_paint_room', null, 'Standard emulsion (per room)', 'entry',   25000, 35000, 50000, 'manual'),
    ('wall_paint_room', null, 'Premium emulsion (per room)',  'mid',     50000, 65000, 90000, 'manual'),
    ('wall_paint_room', null, 'Texture / feature wall (per room)', 'premium', 90000, 120000, 200000, 'manual'),

    ('curtains_window', null, 'Standard curtains (per window)', 'entry',   5500,  8000,  12000, 'manual'),
    ('curtains_window', null, 'Lined curtains (per window)',    'mid',     18000, 25000, 38000, 'manual'),
    ('curtains_window', null, 'Designer drapery (per window)',  'premium', 60000, 80000, 150000, 'manual')
on conflict do nothing;
