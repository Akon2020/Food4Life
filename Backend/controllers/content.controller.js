// Lectures publiques — réponses brutes conformes à Frontend/lib/types.ts.
import {
  Article,
  Product,
  Partner,
  TeamMember,
  Testimonial,
  GalleryItem,
  SiteSetting,
} from "../models/index.model.js";
import {
  serializeArticle,
  serializeProduct,
  serializePartner,
  serializeTeamMember,
  serializeTestimonial,
  serializeGalleryItem,
  serializeSettings,
} from "../utils/serialize.js";

const ARTICLE_CATEGORIES = ["impact", "evenement", "presse"];

// GET /articles?category=  -> Article[] (publiés, tri publishedAt desc)
export const getArticles = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { status: "published" };
    if (category && ARTICLE_CATEGORIES.includes(category)) {
      where.category = category;
    }
    const articles = await Article.findAll({
      where,
      order: [["publishedAt", "DESC"]],
    });
    return res.status(200).json(articles.map(serializeArticle));
  } catch (error) {
    next(error);
  }
};

// GET /articles/:slug -> Article | null
export const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
    });
    return res.status(200).json(serializeArticle(article));
  } catch (error) {
    next(error);
  }
};

// GET /products -> Product[] (tri order)
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [["order", "ASC"]] });
    return res.status(200).json(products.map(serializeProduct));
  } catch (error) {
    next(error);
  }
};

// GET /products/:slug -> Product | null
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
    });
    return res.status(200).json(serializeProduct(product));
  } catch (error) {
    next(error);
  }
};

// GET /partners -> Partner[] (tri order)
export const getPartners = async (req, res, next) => {
  try {
    const partners = await Partner.findAll({ order: [["order", "ASC"]] });
    return res.status(200).json(partners.map(serializePartner));
  } catch (error) {
    next(error);
  }
};

// GET /team -> TeamMember[] (tri order)
export const getTeam = async (req, res, next) => {
  try {
    const team = await TeamMember.findAll({ order: [["order", "ASC"]] });
    return res.status(200).json(team.map(serializeTeamMember));
  } catch (error) {
    next(error);
  }
};

// GET /testimonials -> Testimonial[] (tri order)
export const getTestimonials = async (req, res, next) => {
  try {
    const items = await Testimonial.findAll({ order: [["order", "ASC"]] });
    return res.status(200).json(items.map(serializeTestimonial));
  } catch (error) {
    next(error);
  }
};

// GET /gallery -> GalleryItem[] (tri order)
export const getGallery = async (req, res, next) => {
  try {
    const items = await GalleryItem.findAll({ order: [["order", "ASC"]] });
    return res.status(200).json(items.map(serializeGalleryItem));
  } catch (error) {
    next(error);
  }
};

// GET /settings -> SiteSetting (singleton, créé avec valeurs par défaut si absent)
export const getSettings = async (req, res, next) => {
  try {
    const [settings] = await SiteSetting.findOrCreate({
      where: {},
      defaults: {},
    });
    return res.status(200).json(serializeSettings(settings));
  } catch (error) {
    next(error);
  }
};
