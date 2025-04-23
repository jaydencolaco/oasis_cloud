// import { NextResponse } from "next/server";
// import path from "path";
// import { writeFile } from "fs/promises";

// export const POST = async (req: any) => {
//   const formData = await req.formData();

//   const file = formData.get("file");
//   if (!file) {
//     return NextResponse.json({ error: "No files received." }, { status: 400 });
//   }

//   const buffer = Buffer.from(await file.arrayBuffer());
//   const filename = Date.now() + file.name.replaceAll(" ", "_");
//   console.log(filename);
//   try {
//     await writeFile(
//       path.join(process.cwd(), "public/uploads/" + filename),
//       buffer
//     );
//     return NextResponse.json({ Message: "Success", status: 201, filename: filename });
//   } catch (error) {
//     console.log("Error occured ", error);
//     return NextResponse.json({ Message: "Failed", status: 500 });
//   }
// };

import { NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch";

export const POST = async (req: any) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64File = buffer.toString("base64");

  // Cloudinary settings
  const cloudName = "dcgsnlf1p"; // Replace with your Cloudinary cloud name
  const uploadPreset = "OasisLuminaires.com"; // Replace with your upload preset

  const form = new FormData();
  form.append("file", `data:${file.type};base64,${base64File}`);
  form.append("upload_preset", uploadPreset);

  try {
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    // Define a type for the response JSON
    type CloudinaryResponse = {
      secure_url: string;
      error?: { message: string };
    };

    // Cast the response JSON to the defined type
    const json = (await cloudinaryResponse.json()) as CloudinaryResponse;

    if (cloudinaryResponse.ok) {
      return NextResponse.json({
        Message: "Success",
        status: 201,
        url: json.secure_url, // Cloudinary URL for the uploaded image
      });
    } else {
      return NextResponse.json(
        { error: json.error?.message || "Unknown error occurred" },
        { status: cloudinaryResponse.status }
      );
    }
  } catch (error) {
    console.error("Upload error: ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
