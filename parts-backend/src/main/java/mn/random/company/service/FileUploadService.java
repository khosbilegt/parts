package mn.random.company.service;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class FileUploadService {
    private final Map<String, String> IMAGES = new HashMap<>();

    public String processFile(byte[] fileData) {
        String uuid = UUID.randomUUID().toString();
        String base64Image = Base64.getEncoder().encodeToString(fileData);
        IMAGES.put(uuid, base64Image);
        return uuid;
    }

    public String getImage(String uuid) {
        if(IMAGES.containsKey(uuid)) {
            String image = IMAGES.get(uuid);
            IMAGES.remove(uuid);
            return image;
        }
        return null;
    }
}