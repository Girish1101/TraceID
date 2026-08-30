import cloudinary from "cloudinary";

export const dynamic = "force-static";

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudinary is configured, upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const result: any = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream(
            { folder: "faces" },
            (err, res) => {
              if (err) reject(err);
              else resolve(res);
            }
          ).end(buffer);
        });
        return Response.json({ imageUrl: result.secure_url });
      } catch (cloudErr) {
        console.warn("[upload-image] Cloudinary upload failed, falling back to Data URI:", cloudErr);
      }
    }

    // Fallback: convert file buffer to Data URI (works locally without Cloudinary keys)
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    return Response.json({ imageUrl: dataUri });

  } catch (err: any) {
    console.error("[upload-image]", err);
    return Response.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
